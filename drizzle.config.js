/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:npg_J7ZGrzUHh6jy@ep-shiny-block-adhsm3x3-pooler.c-2.us-east-1.aws.neon.tech/content_gen?sslmode=require&channel_binding=require',

    }
  };
  
