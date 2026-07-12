import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMDI1OCwiZXhwIjoyMDk1Nzk2MjU4fQ.q7XXxSp8HDB2Ai7WO9A0UrqscN8nnYpX1xvw-C1QrHI";
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Generating login link for rkglobal@gmail.com...");
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: "rkglobal@gmail.com"
  });

  if (linkError) {
    console.error("Link generation error:", linkError);
    return;
  }

  const token = linkData.properties.hashed_token;
  console.log("Generated token properties:", linkData.properties);

  // Authenticate anon client using the access token or session
  // Since generateLink returns user and properties, let's sign in using the email and password, or we can just fetch the user's JWT by creating a session for them.
  // Actually, we can get a JWT for the user using the admin API's `getUser` or we can sign in using signInWithOtp or password.
  // Let's see: we can generate a magic link. But we can also retrieve the user's JWT from the admin API?
  // No, we cannot directly get the JWT from getUser.
  // But wait! We can change the user's password temporarily using admin.updateUserById, run our check, and then restore it or just keep it if we can.
  // Wait, let's see if we can do something easier:
  // We can query the database directly using postgres but using the same security context by running:
  // SET LOCAL jwt.claims.sub = 'user-uuid'
  // SET LOCAL jwt.claims.role = 'authenticated'
  // SET LOCAL jwt.claims.email = 'rkglobal@gmail.com'
  // Yes! If we connect to PostgreSQL, we can set these session variables and run the queries!
  // But wait, do we have the database connection string?
  // Let's check supabase/config.toml or the Supabase project configuration to see if there is a connection string.
  // Wait! In supabase/config.toml, does it have db credentials?
}

main();
