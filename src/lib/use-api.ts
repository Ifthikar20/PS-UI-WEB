"use client";

import * as React from "react";
import { api, ApiError } from "./api";

/** Normalize an endpoint that may return a bare array OR a paginated object. */
export function asList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  const results = (data as { results?: unknown } | null)?.results;
  return Array.isArray(results) ? (results as T[]) : [];
}

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/** Minimal GET hook for the BFF proxy. */
export function useApi<T>(djangoPath: string | null) {
  const [state, setState] = React.useState<State<T>>({
    data: null,
    loading: Boolean(djangoPath),
    error: null,
  });

  const reload = React.useCallback(() => {
    if (!djangoPath) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get<T>(djangoPath)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e) =>
        setState({
          data: null,
          loading: false,
          error: e instanceof ApiError ? e.message : "Failed to load",
        }),
      );
  }, [djangoPath]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
