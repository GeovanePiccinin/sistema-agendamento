"use client";

import { useQuery } from "@tanstack/react-query";

interface QueryTestData {
  message: string;
}

async function fetchQueryTest(): Promise<QueryTestData> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 500);
  });

  return {
    message: "React Query está funcionando.",
  };
}

export function QueryTest() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["query-test"],
    queryFn: fetchQueryTest,
  });

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">Erro ao executar a consulta.</p>
    );
  }

  return <p className="text-sm text-muted-foreground">{data.message}</p>;
}
