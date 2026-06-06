"use client";

import { useMemo, useState } from "react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { WorkflowCard } from "@/components/workflows/WorkflowCard";
import {
  WorkflowForm,
  type WorkflowFormValues,
} from "@/components/workflows/WorkflowForm";
import type { Workflow, WorkflowStatus } from "@/lib/types";
import { buildWorkflowSteps, deriveWorkflowStatus } from "@/lib/utils/workflow";

export default function WorkflowsPage() {
  const { workflows, addWorkflow, updateWorkflow, deleteWorkflow } =
    useWorkflows();
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "all">(
    "all"
  );
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow>();
  const [deletingWorkflow, setDeletingWorkflow] = useState<Workflow>();

  const filtered = useMemo(() => {
    if (statusFilter === "all") return workflows;
    return workflows.filter((workflow) => workflow.status === statusFilter);
  }, [workflows, statusFilter]);

  const openCreateForm = () => {
    setFormMode("create");
    setEditingWorkflow(undefined);
    setFormOpen(true);
  };

  const openEditForm = (workflow: Workflow) => {
    setFormMode("edit");
    setEditingWorkflow(workflow);
    setFormOpen(true);
  };

  const handleSubmit = (values: WorkflowFormValues) => {
    const steps = buildWorkflowSteps(
      values.steps.map((step) => ({
        title: step.title,
        dueDate: step.dueDate || undefined,
      })),
      workflows,
      formMode === "edit" && editingWorkflow ? editingWorkflow.steps : []
    );

    const payload = {
      title: values.title,
      description: values.description || undefined,
      steps,
      status: deriveWorkflowStatus(steps),
    };

    if (formMode === "create") {
      addWorkflow(payload);
      return;
    }

    if (editingWorkflow) {
      updateWorkflow(editingWorkflow.id, payload);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingWorkflow) {
      deleteWorkflow(deletingWorkflow.id);
      setDeletingWorkflow(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as WorkflowStatus | "all")
          }
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
        >
          <option value="all">Tüm süreçler</option>
          <option value="active">Aktif</option>
          <option value="completed">Tamamlanmış</option>
        </select>
        <Button type="button" onClick={openCreateForm}>
          + Yeni Süreç
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Süreç bulunamadı"
          description="Yeni bir süreç oluşturarak başla."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onEdit={() => openEditForm(workflow)}
            />
          ))}
        </div>
      )}

      <WorkflowForm
        open={formOpen}
        mode={formMode}
        initialWorkflow={editingWorkflow}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      {formMode === "edit" && editingWorkflow && (
        <div className="flex justify-end">
          <Button
            variant="danger"
            type="button"
            onClick={() => {
              setFormOpen(false);
              setDeletingWorkflow(editingWorkflow);
            }}
          >
            Süreci Sil
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deletingWorkflow)}
        title="Süreci sil"
        message={`"${deletingWorkflow?.title}" sürecini silmek istediğine emin misin?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingWorkflow(undefined)}
      />
    </div>
  );
}
