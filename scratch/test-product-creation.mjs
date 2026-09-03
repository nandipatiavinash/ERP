import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const tempPassword = "TempPassword123!";
const userEmail = "nandipatiavinash19@gmail.com";

async function main() {
  console.log("Signing in...");
  const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: tempPassword
  });

  if (signInError) {
    console.error("Sign in error:", signInError);
    return;
  }

  console.log("Inserting test offset product...");
  const { data: offsetData, error: offsetError } = await supabase
    .from("offset_products")
    .insert({
      brand: "Test Offset Brand",
      width: 100,
      height: 200,
      status: "active"
    })
    .select();

  if (offsetError) {
    console.error("Offset Insert Error:", offsetError);
  } else {
    console.log("Offset Insert Success:", offsetData);
    // clean up
    await supabase.from("offset_products").delete().eq("id", offsetData[0].id);
  }

  console.log("Inserting test roto product...");
  const { data: rotoData, error: rotoError } = await supabase
    .from("roto_products")
    .insert({
      brand: "Test Roto Brand",
      width: 150,
      height: 250,
      num_cylinders: 4,
      status: "active"
    })
    .select();

  if (rotoError) {
    console.error("Roto Insert Error:", rotoError);
  } else {
    console.log("Roto Insert Success:", rotoData);
    // clean up
    await supabase.from("roto_products").delete().eq("id", rotoData[0].id);
  }
}

main();
