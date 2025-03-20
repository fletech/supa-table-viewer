import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || supabaseUrl === "" || supabaseUrl === "URL_DE_SUPABASE") {
  console.error("Error: No se ha proporcionado una URL válida de Supabase.");
  process.exit(1);
}

if (!supabaseKey || supabaseKey === "" || supabaseKey === "CLAVE_DE_SUPABASE") {
  console.error("Error: No se ha proporcionado una clave válida de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session || !session.user) {
      console.log("No hay sesión activa. Por favor, inicia sesión primero.");
      return;
    }

    const userId = session.user.id;
    console.log("ID de usuario:", userId);

    const sqlFilePath = path.join(__dirname, "seed_data.sql");
    let sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    sqlContent = sqlContent.replace(/YOUR_USER_ID/g, userId);

    const updatedSqlFilePath = path.join(__dirname, "seed_data_updated.sql");
    fs.writeFileSync(updatedSqlFilePath, sqlContent);

    console.log(`Archivo SQL actualizado guardado en: ${updatedSqlFilePath}`);
    console.log("Ahora se puede ejecutar este archivo en Supabase.");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
