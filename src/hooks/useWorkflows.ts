import { useApp } from "@/providers/AppProvider";

export function useWorkflows() {
  const {
    workflows,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    updateStep,
  } = useApp();
  return {
    workflows,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    updateStep,
  };
}
