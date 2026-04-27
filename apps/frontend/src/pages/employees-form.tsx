import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ManageEmployeeForm from "../components/Management/ManageEmployeeForm.tsx";

import { API_ENDPOINTS } from "../config.ts";
import { EmployeeFormSchema, type EmployeeFormData } from "../types/employee";

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async (formData: EmployeeFormData) => {
    if (saving) return;

    const parsed = EmployeeFormSchema.parse(formData);

    try {
      setSaving(true);

      const res = await fetch(API_ENDPOINTS.EMPLOYEE.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(parsed),
      });

      if (res.ok) {
        navigate("/employee-management");
        return;
      }

      const errorText = await res.text().catch(() => "");
      console.error("Create employee failed:", errorText);
      alert("Create employee failed. Please check the required fields.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ManageEmployeeForm
      initialData={null}
      onSave={handleSave}
      onCancel={() => navigate("/employee-management")}
    />
  );
}
