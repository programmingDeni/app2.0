import React from "react";

interface Props<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | undefined;
  resourceName?: string;
  children: (data: T) => React.ReactNode;
}

export function QueryStateWrapper<T>({
  isLoading,
  error,
  data,
  resourceName = "Daten",
  children
}: Props<T>) {
  if (isLoading) {
    return <div>Lädt {resourceName}...</div>;
  }

  if (error) {
    return <div>Fehler beim Laden der {resourceName}: {error.message}</div>;
  }

  if (!data) {
    return <div>Keine {resourceName} vorhanden</div>;
  }

  return <>{children(data)}</>;
}