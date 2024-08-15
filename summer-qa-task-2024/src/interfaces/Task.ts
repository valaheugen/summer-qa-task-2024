export type Importance = "Low" | "Medium" | "High";
export type Label = "Work" | "Social" | "Home" | "Hobby";

export interface Task {
  id: string; // Unique identifier for each task
  title: string; // Title of the task
  description: string; // Description of the task
  completed: boolean; // Status to indicate if the task is completed
  importance: Importance; // Importance level of the task
  label: Label; // Label to categorize the task
}
