/**
 * Batch Translation Script for AntarYatra
 * 
 * This script adds all 200+ tool translation keys to the remaining 10 languages
 * in lib/i18n/translations.ts
 * 
 * Usage: node scripts/add-translations.js
 */

const fs = require('fs');
const path = require('path');

// Translation mappings for each language
// These maintain the regional flavor while being accurate
const translations = {
  tanglish: {
    // Breathing Exercises
    "breathing.title": "Moochchu Exercise",
    "breathing.technique478": "4-7-8 Technique",
    "breathing.technique478Desc": "Thookam aur tension-kku Dr. Weil-oda relaxation technique da",
    "breathing.techniqueBox": "Box Breathing",
    "breathing.techniqueBoxDesc": "Focus aur stress relief-kku Navy SEAL technique machan",
    "breathing.techniqueCalm": "2-Minute Shanti",
    "breathing.techniqueCalmDesc": "Udane aaraam-kku quick calming technique",
    "breathing.inhale": "Moochchu Ulley Edu",
    "breathing.hold": "Hold Pannu",
    "breathing.exhale": "Moochchu Veliya Vidu",
    "breathing.inhaleInstruction": "Mookkula irundhu moochchu ulley edu",
    "breathing.holdInstruction": "Moochcha mella hold pannu",
    "breathing.exhaleInstruction": "Vaayula irundhu mella moochchu vidu",
    "breathing.benefitReduceAnxiety": "Tension kammi agum",
    "breathing.benefitSleep": "Thookam nalla varum",
    "breathing.benefitCalm": "Nervous system-a shaant pannum",
    "breathing.benefitFocus": "Focus-a improve pannum",
    "breathing.benefitStress": "Stress-a reduce pannum",
    "breathing.benefitRegulate": "Emotions-a regulate pannum",
    "breathing.cycles": "Cycles Mudinjiruchu",
    "breathing.start": "Session Start Pannu",
    "breathing.pause": "Pause Pannu",
    "breathing.reset": "Marupadi Aarambikka",
    "breathing.ready": "Oru comfortable position la ukkaaru da",
    
    // Interactive Assessment
    "assessment.title": "Mental Health Assessment",
    "assessment.question1": "Indha week-la unga stress level eppadi irukku?",
    "assessment.question2": "Ippo thookam nalla varuthaa?",
    "assessment.question3": "Evlo adhigama overwhelm feel aagura?",
    "assessment.question4": "Naal muzhuvathum unga energy level eppadi?",
    "assessment.veryLow": "Romba Kammi",
    "assessment.low": "Kammi",
    "assessment.moderate": "Sari-aana",
    "assessment.high": "Jaasthi",
    "assessment.veryHigh": "Romba Jaasthi",
    "assessment.excellent": "Super-u",
    "assessment.good": "Nalla",
    "assessment.fair": "Paravala",
    "assessment.poor": "Kevalama",
    "assessment.veryPoor": "Romba Kevalama",
    "assessment.rarely": "Oru nimisham",
    "assessment.sometimes": "Sila samayam",
    "assessment.often": "Adhigama",
    "assessment.veryOften": "Romba Adhigama",
    "assessment.always": "Epavume",
    "assessment.highEnergy": "High Energy",
    "assessment.average": "Average",
    "assessment.exhausted": "Romba Tired",
    "assessment.resultsTitle": "Unga Wellness Score",
    "assessment.score": "Score",
    "assessment.restart": "Marupadi Edu",
    "assessment.recommendations": "Unakku Recommendations",
    
    // Emotion Wheel
    "emotion.title": "Emotion Wheel",
    "emotion.subtitle": "Unga emotions-a identify pannu, purinjukko",
    "emotion.selectPrimary": "Primary emotion select pannu",
    "emotion.selectSecondary": "Azhama explore pannu",
    "emotion.joy": "Santhosham",
    "emotion.sadness": "Kavalai",
    "emotion.fear": "Bayam",
    "emotion.anger": "Kovam",
    "emotion.disgust": "Vena",
    "emotion.surprise": "Achariyam",
    "emotion.joyDesc": "Santhoshama, content-a, positive-a feel pannura",
    "emotion.sadnessDesc": "Dull-a, disconnected-a, loss feel pannura",
    "emotion.fearDesc": "Threat, worried, unsafe feel pannura",
    "emotion.angerDesc": "Irritated, upset, hostile feel pannura",
    "emotion.disgustDesc": "Aversion illa strong disapproval feel pannura",
    "emotion.surpriseDesc": "Unexpected reactions",
    "emotion.reset": "Marupadi Select Pannu",
    "emotion.saveJournal": "Journal-la Save Pannu",
    
    // Anger Room
    "anger.title": "Virtual Anger Room",
    "anger.subtitle": "Safe space-la frustration vidu da",
    "anger.score": "Stress Released",
    "anger.angerLevel": "Kovam Level",
    "anger.clickAnywhere": "Enga venalum click pannu, things-a throw pannalam!",
    "anger.plateThrow": "Plate",
    "anger.glassThrow": "Glass",
    "anger.vaseThrow": "Vase",
    "anger.tvThrow": "TV",
    "anger.phoneThrow": "Phone",
    "anger.lampThrow": "Lamp",
    "anger.startSession": "Kovatha Vidu",
    "anger.endSession": "Mudichudu",
    "anger.highScore": "High Score",
    "anger.feelBetter": "Better feel aagraa machan?",
    
    // Guided Visualization
    "visualization.title": "Guided Visualization",
    "visualization.river": "Aaru-la Meludhura",
    "visualization.riverDesc": "Shaanta thanni payanam",
    "visualization.forest": "Pazhaya Kaadu-la Nadakka",
    "visualization.forestDesc": "Iyarkai connection",
    "visualization.stars": "Natchathira Naduvula Parakka",
    "visualization.starsDesc": "Cosmic shanti",
    "visualization.play": "Yatra Aarambikka",
    "visualization.pause": "Nilluththu",
    "visualization.reset": "Vera Yatra Select Pannu",
    "visualization.duration": "Duration",
    "visualization.minutes": "nimisham",
    
    // Grounding Technique
    "grounding.title": "5-4-3-2-1 Grounding",
    "grounding.subtitle": "Present moment-la vaa da",
    "grounding.see": "Paaru",
    "grounding.touch": "Thoddu",
    "grounding.hear": "Kelu",
    "grounding.smell": "Vasana Paaru",
    "grounding.taste": "Rusichchi Paaru",
    "grounding.prompt5": "5 vishayam sollu unakku theriyura",
    "grounding.prompt4": "4 vishayam sollu nee thodda mudiura",
    "grounding.prompt3": "3 vishayam sollu nee kekka mudiura",
    "grounding.prompt2": "2 vishayam sollu unakku smell aagura",
    "grounding.prompt1": "1 vishayam sollu nee taste panna virumburadhu",
    "grounding.placeholder": "Unga answer inga type pannu...",
    "grounding.next": "Adhutthadhu",
    "grounding.complete": "Mudinjiruchu!",
    "grounding.restart": "Marupadi Aarambikka",
    "grounding.wellDone": "Nalla pannita! Nee grounded aayitta.",
    
    // Mental Health Pomodoro
    "pomodoro.title": "Wellness Pomodoro",
    "pomodoro.focusTime": "Focus Time",
    "pomodoro.shortBreak": "Chinna Break",
    "pomodoro.longBreak": "Periya Break",
    "pomodoro.start": "Start Pannu",
    "pomodoro.pause": "Pause Pannu",
    "pomodoro.reset": "Reset Pannu",
    "pomodoro.sessions": "Sessions",
    "pomodoro.breakActivity": "Break Activity",
    "pomodoro.sessionComplete": "Session Complete!",
    
    // Crisis Toolkit
    "crisisKit.title": "Crisis Support Toolkit",
    "crisisKit.subtitle": "Unakku mudhal help venuna udane",
    "crisisKit.hotlines": "Emergency Hotlines",
    "crisisKit.call": "Ippo Call Pannu",
    "crisisKit.available": "Available",
    "crisisKit.quickExercises": "Seekirama Shanthi Exercise",
    "crisisKit.tryNow": "Ippo Try Pannu",
    "crisisKit.aasra": "AASRA (India)",
    "crisisKit.aasraDesc": "Suicide prevention & emotional support helpline",
    "crisisKit.vandrevala": "Vandrevala Foundation (India)",
    "crisisKit.vandrevalaDesc": "Mental health support and crisis intervention",
    "crisisKit.icall": "iCall Psychosocial Helpline",
    "crisisKit.icallDesc": "Tata Institute of Social Sciences helpline",
    "crisisKit.snehi": "Snehi India Foundation",
    "crisisKit.snehiDesc": "Distress-la emotional support",
    "crisisKit.nimhans": "NIMHANS Helpline",
    "crisisKit.nimhansDesc": "Mental health emergency support",
    "crisisKit.fortis": "Fortis Stress Helpline",
    "crisisKit.fortisDesc": "Crisis counseling & mental health support",
    "crisisKit.roshni": "Roshni Trust (Hyderabad)",
    "crisisKit.roshniDesc": "Suicide prevention & emotional support",
    "crisisKit.mitram": "Mitram Foundation (Chennai)",
    "crisisKit.mitramDesc": "Mental health support & counseling",
    
    // Therapist Finder
    "therapist.title": "Therapist Kanupidichu",
    "therapist.subtitle": "Unga area-la professional mental health care",
    "therapist.search": "Location illa specialty-la theddu",
    "therapist.viewProfile": "Profile Paaru",
    "therapist.bookSession": "Session Book Pannu",
    "therapist.experience": "varushangal experience",
    "therapist.languages": "Bhashaigal",
    "therapist.specialties": "Specialties",
    
    // Dashboard Pages
    "journal.title": "Journal",
    "journal.newEntry": "Pudhu Entry",
    "journal.allEntries": "Ella Entries",
    "journal.aiPrompts": "AI Writing Prompts",
    "journal.save": "Save Pannu",
    "journal.delete": "Delete Pannu",
    "journal.edit": "Edit Pannu",
    
    "mood.title": "Mood Tracker",
    "mood.selectMood": "Eppadi feel aagura?",
    "mood.energy": "Energy Level",
    "mood.stress": "Stress Level",
    "mood.anxiety": "Anxiety Level",
    "mood.activities": "Activities",
    "mood.notes": "Notes",
    "mood.trackMood": "Mood Track Pannu",
    "mood.history": "Mood History",
    
    "community.title": "Community",
    "community.share": "Unga Kadhai Share Pannu",
    "community.stories": "Community Kadhaihal",
    "community.support": "Support Kudu",
    "community.anonymous": "Anonymous-a Share Pannu",
    
    "rewards.title": "Rewards & Achievements",
    "rewards.badges": "Unga Badges",
    "rewards.streak": "Streak Milestones",
    "rewards.points": "Total Points",
    "rewards.unlocked": "Unlocked",
    "rewards.locked": "Locked",
    
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.notifications": "Notifications",
    "settings.privacy": "Privacy",
    "settings.language": "Bhasha",
    "settings.theme": "Theme",
    "settings.account": "Account",
    "settings.logout": "Logout",
    
    // Admin Panel
    "admin.title": "Admin Dashboard",
    "admin.users": "Total Users",
    "admin.entries": "Journal Entries",
    "admin.moods": "Mood Logs",
    "admin.moderation": "Content Moderation",
    "admin.analytics": "Analytics",
    "admin.waitlist": "Waitlist Management"
  },
  
  // Add more languages as needed...
  // This is a template - the full script would include all 10 languages
};

// Generate translation block for a language
function generateTranslationBlock(langKey, translations) {
  let output = '';
  
  Object.entries(translations).forEach(([key, value]) => {
    output += `  "${key}": "${value}",\n`;
  });
  
  return output;
}

// Main function to add translations
function addTranslations() {
  const filePath = path.join(__dirname, '..', 'lib', 'i18n', 'translations.ts');
  
  console.log('🌍 Starting batch translation addition...');
  console.log(`📁 Reading file: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // For each language, find the "tools.games" line and insert translations after it
  Object.entries(translations).forEach(([langKey, langTranslations]) => {
    console.log(`\n📝 Processing ${langKey}...`);
    
    const translationBlock = generateTranslationBlock(langKey, langTranslations);
    
    // Find the pattern for this language's tools.games
    const pattern = new RegExp(
      `(${langKey}:.*?"tools\\.games":\\s*"[^"]+",)`,
      's'
    );
    
    const match = content.match(pattern);
    
    if (match) {
      // Insert the new translations after tools.games
      const replacement = `${match[1]}\n  \n  // Tool Translations\n${translationBlock}`;
      content = content.replace(pattern, replacement);
      console.log(`✅ Added ${Object.keys(langTranslations).length} keys to ${langKey}`);
    } else {
      console.log(`❌ Could not find tools.games for ${langKey}`);
    }
  });
  
  // Write back to file
  console.log('\n💾 Writing updated translations...');
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('\n✨ Translation addition complete!');
  console.log(`📊 Total keys added: ${Object.keys(translations.tanglish).length} per language`);
}

// Run the script
try {
  addTranslations();
} catch (error) {
  console.error('❌ Error adding translations:', error);
  process.exit(1);
}
