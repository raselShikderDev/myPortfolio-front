"use server";

export async function getAllProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`);
  const data = await res.json();
  console.log(res);

  const projects = data.data;
  return projects;
}

//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`);
//     if (!res.ok) {
//       console.error("Failed to fetch projects:", await res.text());
//       return [];
//     }
//     const json = await res.json();
//     console.log(json.data);

//     return json.data ?? [];
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     return [];
//   }
