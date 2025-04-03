import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { users, products } from '@shared/schema';

// Create a Postgres.js client
const client = postgres(process.env.DATABASE_URL!);

// Create a Drizzle ORM instance using the Postgres.js client
export const db = drizzle(client);

export async function initDb() {
  console.log('Initializing the database...');
  
  // Check if admin user exists
  const adminExists = await db.select({ id: users.id })
    .from(users)
    .where(eq(users.username, 'admin'))
    .execute();
    
  if (adminExists.length === 0) {
    // Create admin user
    await db.insert(users)
      .values({
        username: 'admin',
        password: 'admin', // In a real app, use proper password hashing
        isAdmin: true
      })
      .execute();
    console.log('Admin user created');
  }
  
  // Check if we have any products
  const productsExist = await db.select({ count: { value: products.id } })
    .from(products)
    .execute();
    
  if (productsExist.length === 0 || productsExist[0].count?.value === 0) {
    // Add sample products
    await initializeSampleProducts();
    console.log('Sample products added');
  }
}

export async function initializeSampleProducts() {
  // Sample AI products based on the provided list
  const sampleProducts = [
    // Content Creation
    {
      name: 'ChatGPT',
      description: 'AI-powered conversational assistant that can understand and respond to text prompts with human-like responses.',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      websiteUrl: 'https://chat.openai.com',
      launchDate: new Date('2022-11-30'),
      upvotes: 450,
      tags: ['Content Creation', 'Assistant', 'LLM'],
      maker: 'OpenAI',
      makerRole: 'Company',
      makerEmail: 'info@openai.com',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Content Creation',
      featuredTweet: 'ChatGPT has changed the way I work forever. I\'ve been using it for email drafting, code assistance, and learning - it\'s like having an expert for everything at your fingertips!'
    },
    {
      name: 'Jasper',
      description: 'AI content platform that helps marketing teams create SEO content, social posts, and ads with professional quality.',
      logoUrl: 'https://logos-world.net/wp-content/uploads/2023/02/Jasper-New-Symbol.png',
      websiteUrl: 'https://www.jasper.ai',
      launchDate: new Date('2021-01-15'),
      upvotes: 320,
      tags: ['Content Creation', 'Marketing', 'SEO'],
      maker: 'Jasper',
      makerRole: 'Company',
      makerEmail: 'support@jasper.ai',
      isApproved: true,
      isPending: false,
      pricing: 'Paid',
      category: 'Content Creation',
      featuredTweet: null
    },
    {
      name: 'Writer',
      description: 'AI writing platform designed for teams to produce high-quality, on-brand content at scale.',
      logoUrl: 'https://assets-global.website-files.com/60e5f2de011b86acebc30db7/60e5f2de011b86c891c30e34_Writer%20Icon.svg',
      websiteUrl: 'https://writer.com',
      launchDate: new Date('2020-06-15'),
      upvotes: 290,
      tags: ['Content Creation', 'Enterprise', 'Branding'],
      maker: 'Writer',
      makerRole: 'Company',
      makerEmail: 'support@writer.com',
      isApproved: true,
      isPending: false,
      pricing: 'Paid',
      category: 'Content Creation',
      featuredTweet: null
    },
    
    // Video Generation
    {
      name: 'Synthesia',
      description: 'AI video generation platform that turns text into professional-looking videos with virtual presenters.',
      logoUrl: 'https://cdn.synthesia.io/logo/2022/synthesia.svg',
      websiteUrl: 'https://www.synthesia.io',
      launchDate: new Date('2019-09-20'),
      upvotes: 380,
      tags: ['Video Generation', 'Business', 'Creative'],
      maker: 'Synthesia',
      makerRole: 'Company',
      makerEmail: 'hello@synthesia.io',
      isApproved: true,
      isPending: false,
      pricing: 'Paid',
      category: 'Video Generation',
      featuredTweet: null
    },
    {
      name: 'Pictory',
      description: 'AI-powered video creation tool that automatically transforms long-form content into short, engaging videos.',
      logoUrl: 'https://pictory.ai/wp-content/themes/pictoryhome/images/pictory-logo.svg',
      websiteUrl: 'https://pictory.ai',
      launchDate: new Date('2020-11-10'),
      upvotes: 310,
      tags: ['Video Generation', 'Content Repurposing', 'Marketing'],
      maker: 'Pictory',
      makerRole: 'Company',
      makerEmail: 'support@pictory.ai',
      isApproved: true,
      isPending: false,
      pricing: 'Subscription',
      category: 'Video Generation',
      featuredTweet: null
    },
    {
      name: 'Lumen5',
      description: 'Video creation platform that uses AI to transform blog posts and text content into engaging social videos.',
      logoUrl: 'https://storage.googleapis.com/lumen5-site-images/L5-logo/L5-logo-header.png',
      websiteUrl: 'https://lumen5.com',
      launchDate: new Date('2017-04-05'),
      upvotes: 325,
      tags: ['Video Generation', 'Social Media', 'Marketing'],
      maker: 'Lumen5',
      makerRole: 'Company',
      makerEmail: 'support@lumen5.com',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Video Generation',
      featuredTweet: null
    },
    
    // Voice and Music
    {
      name: 'Murf.ai',
      description: 'AI voice generator that creates natural-sounding voiceovers for videos, presentations, and more.',
      logoUrl: 'https://murf.ai/resources/dist/murf.c3d05a1b.svg',
      websiteUrl: 'https://murf.ai',
      launchDate: new Date('2020-03-15'),
      upvotes: 280,
      tags: ['Voice and Music', 'Text-to-Speech', 'Creative'],
      maker: 'Murf AI',
      makerRole: 'Company',
      makerEmail: 'support@murf.ai',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Voice and Music',
      featuredTweet: null
    },
    {
      name: 'AIVA',
      description: 'AI composer that creates original, royalty-free music for content creators, filmmakers, and game developers.',
      logoUrl: 'https://www.aiva.ai/assets/img/logo.svg',
      websiteUrl: 'https://www.aiva.ai',
      launchDate: new Date('2016-02-12'),
      upvotes: 265,
      tags: ['Voice and Music', 'Music Generation', 'Creative'],
      maker: 'AIVA Technologies',
      makerRole: 'Company',
      makerEmail: 'hello@aiva.ai',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Voice and Music',
      featuredTweet: null
    },
    {
      name: 'LALAL.AI',
      description: 'AI-powered vocal and instrumental track separation tool that extracts vocals, drums, and other instruments from any song.',
      logoUrl: 'https://lalal.ai/img/lalal-logo.svg',
      websiteUrl: 'https://www.lalal.ai',
      launchDate: new Date('2019-08-08'),
      upvotes: 245,
      tags: ['Voice and Music', 'Audio Processing', 'Creative'],
      maker: 'LALAL.AI',
      makerRole: 'Company',
      makerEmail: 'support@lalal.ai',
      isApproved: true,
      isPending: false,
      pricing: 'Credit-based',
      category: 'Voice and Music',
      featuredTweet: null
    },
    
    // Scheduling Assistants
    {
      name: 'Motion',
      description: 'AI-powered calendar and project management tool that automatically schedules tasks and meetings for optimal productivity.',
      logoUrl: 'https://www.usemotion.com/logo.svg',
      websiteUrl: 'https://www.usemotion.com',
      launchDate: new Date('2019-06-30'),
      upvotes: 295,
      tags: ['Scheduling Assistants', 'Productivity', 'Project Management'],
      maker: 'Motion',
      makerRole: 'Company',
      makerEmail: 'support@usemotion.com',
      isApproved: true,
      isPending: false,
      pricing: 'Subscription',
      category: 'Scheduling Assistants',
      featuredTweet: null
    },
    {
      name: 'SkedPal',
      description: 'AI-driven time management assistant that intelligently schedules your tasks based on priorities and available time slots.',
      logoUrl: 'https://www.skedpal.com/wp-content/uploads/2021/07/SkedPal-logo-75.png',
      websiteUrl: 'https://www.skedpal.com',
      launchDate: new Date('2015-11-01'),
      upvotes: 220,
      tags: ['Scheduling Assistants', 'Time Management', 'Productivity'],
      maker: 'SkedPal',
      makerRole: 'Company',
      makerEmail: 'support@skedpal.com',
      isApproved: true,
      isPending: false,
      pricing: 'Paid',
      category: 'Scheduling Assistants',
      featuredTweet: null
    },
    {
      name: 'Clockwise',
      description: 'AI scheduling assistant that optimizes your calendar by creating Focus Time and moving meetings to ideal times.',
      logoUrl: 'https://assets-global.website-files.com/6127a84dfe068e153ef20572/612e43bec21fd821366c91ce_Clockwise-Logo-Icon.svg',
      websiteUrl: 'https://www.clockwise.ai',
      launchDate: new Date('2018-10-22'),
      upvotes: 270,
      tags: ['Scheduling Assistants', 'Calendar', 'Productivity'],
      maker: 'Clockwise',
      makerRole: 'Company',
      makerEmail: 'support@clockwise.ai',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Scheduling Assistants',
      featuredTweet: null
    },
    
    // Social Media Management
    {
      name: 'Buffer',
      description: 'AI-enhanced social media management platform that helps schedule posts, analyze performance, and optimize engagement.',
      logoUrl: 'https://buffer.com/static/icons/icon-144x144.png',
      websiteUrl: 'https://buffer.com',
      launchDate: new Date('2010-12-08'),
      upvotes: 340,
      tags: ['Social Media Management', 'Analytics', 'Marketing'],
      maker: 'Buffer',
      makerRole: 'Company',
      makerEmail: 'hello@buffer.com',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Social Media Management',
      featuredTweet: null
    },
    {
      name: 'Vista Social',
      description: 'AI-powered social media management tool designed for agencies and businesses managing multiple client accounts.',
      logoUrl: 'https://vistasocial.com/wp-content/uploads/2021/08/vs-social-media-management-tool-logo.svg',
      websiteUrl: 'https://vistasocial.com',
      launchDate: new Date('2021-02-15'),
      upvotes: 235,
      tags: ['Social Media Management', 'Agency', 'Content Planning'],
      maker: 'Vista Social',
      makerRole: 'Company',
      makerEmail: 'support@vistasocial.com',
      isApproved: true,
      isPending: false,
      pricing: 'Subscription',
      category: 'Social Media Management',
      featuredTweet: null
    },
    {
      name: 'Flick',
      description: 'AI assistant for Instagram that helps generate hashtags, schedule content, and analyze performance metrics.',
      logoUrl: 'https://flick.social/logo.svg',
      websiteUrl: 'https://flick.social',
      launchDate: new Date('2019-07-22'),
      upvotes: 215,
      tags: ['Social Media Management', 'Instagram', 'Content Strategy'],
      maker: 'Flick',
      makerRole: 'Company',
      makerEmail: 'hello@flick.social',
      isApproved: true,
      isPending: false,
      pricing: 'Paid',
      category: 'Social Media Management',
      featuredTweet: null
    },
    
    // Meeting Assistants
    {
      name: 'Fireflies.ai',
      description: 'AI meeting assistant that automatically records, transcribes, and creates searchable notes from your voice conversations.',
      logoUrl: 'https://fireflies.ai/favicon/favicon.svg',
      websiteUrl: 'https://fireflies.ai',
      launchDate: new Date('2019-01-15'),
      upvotes: 330,
      tags: ['Meeting Assistants', 'Transcription', 'Productivity'],
      maker: 'Fireflies.ai',
      makerRole: 'Company',
      makerEmail: 'support@fireflies.ai',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Meeting Assistants',
      featuredTweet: 'Fireflies has completely transformed how our team handles meeting notes. No more scrambling to write things down - it captures everything and the AI summaries are incredibly accurate!'
    },
    {
      name: 'tl;dv',
      description: 'AI meeting recorder and transcriber that captures, summarizes, and shares the key moments from your video calls.',
      logoUrl: 'https://tldv.io/apple-touch-icon.png',
      websiteUrl: 'https://tldv.io',
      launchDate: new Date('2020-05-18'),
      upvotes: 255,
      tags: ['Meeting Assistants', 'Video', 'Remote Work'],
      maker: 'tl;dv',
      makerRole: 'Company',
      makerEmail: 'hello@tldv.io',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Meeting Assistants',
      featuredTweet: null
    },
    {
      name: 'Avoma',
      description: 'AI meeting intelligence platform that provides automatic note-taking, conversation intelligence, and meeting collaboration features.',
      logoUrl: 'https://assets-global.website-files.com/64ce5b8eb59f5c9ef15fcb5a/64ceb59563ed7dd4e87db52c_Logo%20256.png',
      websiteUrl: 'https://www.avoma.com',
      launchDate: new Date('2017-09-01'),
      upvotes: 230,
      tags: ['Meeting Assistants', 'Sales Intelligence', 'Collaboration'],
      maker: 'Avoma',
      makerRole: 'Company',
      makerEmail: 'support@avoma.com',
      isApproved: true,
      isPending: false,
      pricing: 'Subscription',
      category: 'Meeting Assistants',
      featuredTweet: null
    },
    
    // Project Management
    {
      name: 'Asana',
      description: 'AI-enhanced project management platform that helps teams organize, track, and manage their work with intelligent task prioritization.',
      logoUrl: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102016/untitled-1_240.png',
      websiteUrl: 'https://asana.com',
      launchDate: new Date('2008-11-05'),
      upvotes: 385,
      tags: ['Project Management', 'Collaboration', 'Productivity'],
      maker: 'Asana',
      makerRole: 'Company',
      makerEmail: 'support@asana.com',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Project Management',
      featuredTweet: null
    },
    {
      name: 'ClickUp',
      description: 'AI-driven productivity platform that brings tasks, docs, goals, and projects together with AI assistance for optimization.',
      logoUrl: 'https://clickup.com/landing/images/clickup-logo-gradient.svg',
      websiteUrl: 'https://clickup.com',
      launchDate: new Date('2017-01-21'),
      upvotes: 300,
      tags: ['Project Management', 'Task Management', 'Collaboration'],
      maker: 'ClickUp',
      makerRole: 'Company',
      makerEmail: 'help@clickup.com',
      isApproved: true,
      isPending: false,
      pricing: 'Freemium',
      category: 'Project Management',
      featuredTweet: null
    },
    {
      name: 'Wrike',
      description: 'AI-powered work management platform that helps teams plan, organize, and track their work with intelligent workflow suggestions.',
      logoUrl: 'https://www.wrike.com/content/uploads/2023/07/wrike-favicon-small.jpg',
      websiteUrl: 'https://www.wrike.com',
      launchDate: new Date('2006-09-15'),
      upvotes: 275,
      tags: ['Project Management', 'Enterprise', 'Work Management'],
      maker: 'Wrike',
      makerRole: 'Company',
      makerEmail: 'support@team.wrike.com',
      isApproved: true,
      isPending: false,
      pricing: 'Subscription',
      category: 'Project Management',
      featuredTweet: null
    }
  ];

  // Insert all sample products
  for (const product of sampleProducts) {
    await db.insert(products)
      .values(product)
      .execute();
  }
}