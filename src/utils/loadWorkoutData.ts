import * as XLSX from "xlsx";

export async function loadWorkoutData() {
  const response = await fetch("/data/workouts.xlsx");
  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(sheet);

  return jsonData;
}
