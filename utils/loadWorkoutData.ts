import * as XLSX from "xlsx";

export async function loadWorkoutData() {
  console.log("Fetching XLSX...");

  const response = await fetch("/data/workouts.xlsx");

  if (!response.ok) {
    throw new Error("Failed to fetch XLSX");
  }

  const arrayBuffer = await response.arrayBuffer();
  console.log("XLSX fetched");

  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  console.log("Sheets:", workbook.SheetNames);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  console.log("Parsed data:", data);

  return data;
}
