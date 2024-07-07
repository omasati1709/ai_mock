/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://ai-mock_owner:zF2wRBgdaAj6@ep-crimson-shape-a5grn02t.us-east-2.aws.neon.tech/ai-mock?sslmode=require',
    }
};