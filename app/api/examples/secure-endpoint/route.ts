/**
 * Example Secure API Route with Rate Limiting
 * Copy this pattern to other API routes for security
 *
 * Location: app/api/examples/secure-endpoint/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limit';
import { chatMessageSchema } from '@/lib/security/validation';
import { createClient } from '@supabase/supabase-js';

// Lazy-initialize supabase client only when actually needed
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabase;
}

/**
 * POST /api/examples/secure-endpoint
 * Example: Send a chat message with full security
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting (100 requests per 15 minutes per IP)
    const rateLimitError = rateLimit(request, 100, 900000);
    if (rateLimitError) {
      return rateLimitError;
    }

    // 2. Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from Supabase
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 }
      );
    }
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();

    // Validate message using schema
    const message = await chatMessageSchema.parseAsync(body.message);

    // 4. Verify data ownership (user can only create their own messages)
    if (body.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // 5. Database operation with RLS enforced
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .insert({
        user_id: user.id,
        username: user.user_metadata?.username || 'Anonymous',
        message: message,
        room_id: body.roomId || null,
        is_public: body.isPublic !== false,
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // 6. Return safe response (no sensitive data)
    return NextResponse.json({
      success: true,
      data: data?.[0],
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/examples/secure-endpoint
 * Example: Fetch messages with user verification
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimitError = rateLimit(request, 200, 900000); // Higher limit for GET
    if (rateLimitError) {
      return rateLimitError;
    }

    // 2. Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // 3. Query with RLS (only returns user's accessible data)
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, username, message, created_at, room_id')
      .limit(50)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
