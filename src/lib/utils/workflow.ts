import type { Workflow, WorkflowStep, WorkflowStatus } from "@/lib/types";

export function deriveWorkflowStatus(steps: WorkflowStep[]): WorkflowStatus {
  const allDone = steps.every(
    (step) => step.status === "completed" || step.status === "skipped"
  );
  return allDone ? "completed" : "active";
}

export function applyStepUpdate(
  workflow: Workflow,
  stepId: string,
  updates: Partial<WorkflowStep>
): Workflow {
  const now = new Date().toISOString();
  const steps = workflow.steps.map((step) => {
    if (step.id !== stepId) return step;

    const next: WorkflowStep = { ...step, ...updates };

    if (updates.status === "completed" && !next.completedAt) {
      next.completedAt = now;
    }

    if (updates.status && updates.status !== "completed") {
      next.completedAt = undefined;
    }

    return next;
  });

  const status = deriveWorkflowStatus(steps);

  return {
    ...workflow,
    steps,
    status,
    updatedAt: now,
    completedAt: status === "completed" ? now : undefined,
  };
}

function createStepIds(count: number, workflows: Workflow[]): string[] {
  const allSteps = workflows.flatMap((workflow) => workflow.steps);
  const numbers = allSteps
    .map((step) => Number(step.id.split("-").pop()))
    .filter((n) => !Number.isNaN(n));
  let next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return Array.from({ length: count }, () => {
    const id = `step-${String(next).padStart(3, "0")}`;
    next += 1;
    return id;
  });
}

export function buildWorkflowSteps(
  inputs: Array<{ title: string; dueDate?: string }>,
  workflows: Workflow[],
  existingSteps: WorkflowStep[] = []
): WorkflowStep[] {
  const newCount = inputs.filter((input, index) => {
    const existing = existingSteps[index];
    return !existing || existing.title !== input.title;
  }).length;

  const newStepIds = createStepIds(newCount, workflows);
  let newIdIndex = 0;

  return inputs.map((input, index) => {
    const existing = existingSteps[index];
    const keepExisting = existing && existing.title === input.title;

    return {
      id: keepExisting ? existing.id : newStepIds[newIdIndex++],
      order: index + 1,
      title: input.title,
      status: keepExisting ? existing.status : index === 0 ? "in_progress" : "pending",
      dueDate: input.dueDate || undefined,
      notes: keepExisting ? existing.notes : undefined,
      completedAt: keepExisting ? existing.completedAt : undefined,
      reminderIds: keepExisting ? existing.reminderIds : undefined,
    };
  });
}
