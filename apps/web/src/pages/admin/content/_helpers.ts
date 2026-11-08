import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";

export type FormData = Record<string, unknown>;

export const loc = (v: FormData, key: string, lang: string): string => {
  const f = v[key];
  if (f && typeof f === "object")
    return ((f as Record<string, unknown>)[lang] as string) ?? "";
  return "";
};

export const str = (v: FormData, key: string): string => {
  const val = v[key];
  return typeof val === "string" ? val : "";
};

export const bool = (v: FormData, key: string): boolean => !!v[key];

export function useAdminForm(
  queryKey: string[],
  queryFn: () => Promise<unknown>,
  mutateFn: (data: FormData) => Promise<unknown>,
) {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const { data, isLoading, isSuccess } = useQuery({ queryKey, queryFn });
  const [local, setLocal] = useState<FormData>({});
  const values: FormData = { ...(data as FormData), ...local };
  const mutation = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success(lang === "en" ? "Saved!" : "Tersimpan!");
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to save" : "Gagal menyimpan"),
  });
  const handleChange = (key: string, value: unknown) =>
    setLocal((p) => ({ ...p, [key]: value }));
  const handleLocChange = (key: string, l: string, value: string) =>
    setLocal((p) => {
      const existing =
        (p[key] as Record<string, unknown>) ??
        ((data as FormData)?.[key] as Record<string, unknown>) ??
        {};
      return {
        ...p,
        [key]: { ...existing, [l]: value },
      };
    });
  const save = (e?: { preventDefault(): void }, overrides?: FormData) => {
    e?.preventDefault();
    mutation.mutate(overrides ? { ...values, ...overrides } : values);
  };
  return {
    values,
    isLoading,
    isSuccess,
    mutation,
    handleChange,
    handleLocChange,
    save,
  };
}
