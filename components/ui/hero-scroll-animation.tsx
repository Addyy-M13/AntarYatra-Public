'use client';

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import React, { useRef, forwardRef } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface SectionProps {
  scrollYProgress: MotionValue<number>;
}

interface HeroScrollAnimationProps {
  isCrisisPage?: boolean;
  crisisTitle?: React.ReactNode;
  crisisSubtitle?: React.ReactNode;
  onScrollComplete?: () => void;
}

const Section1: React.FC<SectionProps & { isCrisisPage?: boolean }> = ({ scrollYProgress, isCrisisPage }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  if (isCrisisPage) {
    return (
      <motion.section
        style={{ scale, rotate }}
        className='sticky font-semibold top-0 h-screen bg-gradient-to-t to-[#0a0a1a] from-[#06060e] flex flex-col items-center justify-center'
      >
        <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

        <div className='relative z-10 flex flex-col items-center text-center px-8 max-w-4xl'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 mb-6 text-sm font-medium border border-red-500/30'>
            🆘 24/7 Crisis Support
          </div>
          <h1 className='2xl:text-8xl text-6xl font-bold text-center tracking-tight leading-[1.1] mb-6 text-white'>
            We're Here For You
          </h1>
          <p className='text-xl md:text-2xl text-gray-300 font-medium max-w-2xl leading-relaxed'>
            Professional mental health support and crisis resources available instantly. You're not alone. Scroll to explore help options. 👇
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      style={{ scale, rotate }}
      className='sticky font-semibold top-0 h-screen bg-gradient-to-t to-[#dadada] from-[#ebebeb] flex flex-col items-center justify-center text-black'
    >
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

      <h1 className='2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%]'>
        An Hero section Animation <br /> Scroll Please 👇
      </h1>
    </motion.section>
  );
};

const Section2: React.FC<SectionProps & { isCrisisPage?: boolean }> = ({ scrollYProgress, isCrisisPage }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  if (isCrisisPage) {
    return (
      <motion.section
        style={{ scale, rotate }}
        className='relative h-screen bg-gradient-to-t to-[#0a0a1a] from-[#06060e] text-white'
      >
        <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
        <article className='container mx-auto relative z-10 px-6 py-10 flex flex-col justify-center h-full'>
          <h1 className='text-5xl md:text-6xl leading-[100%] py-10 font-bold tracking-tight'>
            Crisis resources and <br />
            <span className='bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'>
              immediate support
            </span>
          </h1>
          <div className='grid grid-cols-3 md:grid-cols-3 gap-4'>
            <img
              src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop'
              alt='Support and care'
              className='object-cover w-full rounded-xl h-48 md:h-full'
            />
            <img
              src='https://images.unsplash.com/photo-1516534775068-bb57e39c7b66?w=500&auto=format&fit=crop'
              alt='Mental health support'
              className='object-cover w-full rounded-xl h-48 md:h-full'
            />
            <img
              src='https://images.unsplash.com/photo-1557821552-17105176677c?w=500&auto=format&fit=crop'
              alt='Professional help'
              className='object-cover w-full rounded-xl h-48 md:h-full'
            />
          </div>
        </article>
      </motion.section>
    );
  }

  return (
    <motion.section
      style={{ scale, rotate }}
      className='relative h-screen bg-gradient-to-t to-[#1a1919] from-[#06060e] text-white'
    >
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
      <article className='container mx-auto relative z-10'>
        <h1 className='text-6xl leading-[100%] py-10 font-semibold tracking-tight'>
          Images That doesn't Make any sense <br /> but still in this section
        </h1>
        <div className='grid grid-cols-4 gap-4'>
          <img
            src='https://images.unsplash.com/photo-1717893777838-4e222311630b?w=1200&auto=format&fit=crop'
            alt='img'
            className='object-cover w-full rounded-md h-full'
          />
          <img
            src='https://images.unsplash.com/photo-1717618389115-88db6d7d8f77?w=500&auto=format&fit=crop'
            alt='img'
            className='object-cover w-full rounded-md'
          />
          <img
            src='https://images.unsplash.com/photo-1717588604557-55b2888f59a6?w=500&auto=format&fit=crop'
            alt='img'
            className='object-cover w-full rounded-md h-full'
          />
          <img
            src='https://images.unsplash.com/photo-1713417338603-1b6b72fcade2?w=500&auto=format&fit=crop'
            alt='img'
            className='object-cover w-full rounded-md h-full'
          />
        </div>
      </article>
    </motion.section>
  );
};

const HeroScrollAnimation = forwardRef<HTMLElement, HeroScrollAnimationProps>(
  ({ isCrisisPage = false, crisisTitle, crisisSubtitle, onScrollComplete }, ref) => {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ['start start', 'end end'],
    });

    return (
      <>
        <main ref={container} className={`relative ${isCrisisPage ? 'h-[200vh]' : 'h-[200vh]'} bg-black`}>
          <Section1 scrollYProgress={scrollYProgress} isCrisisPage={isCrisisPage} />
          <Section2 scrollYProgress={scrollYProgress} isCrisisPage={isCrisisPage} />
          {!isCrisisPage && (
            <footer className='group bg-[#06060e]'>
              <h1 className='text-[16vw] translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear'>
                ui-layout
              </h1>
              <div className='bg-black text-white h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full'></div>
            </footer>
          )}
        </main>
      </>
    );
  }
);

HeroScrollAnimation.displayName = 'HeroScrollAnimation';

export default HeroScrollAnimation;
