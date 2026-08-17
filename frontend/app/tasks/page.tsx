"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getTasks, Task, updateTask } from "../../lib/api";

const PAGE_SIZE = 5;

export default function TasksPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [assignee, setAssignee] = useState("all");
    const [page, setPage] = useState(1);

    const [authenticated, setAuthenticated] = useState(false);

    /*
     * Check authentication before displaying the board.
     */
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        setAuthenticated(true);
    }, [router]);

    /*
     * Fetch tasks through React Query.
     */
    const {
        data: tasks = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks,
        enabled: authenticated,
    });

    /*
     * Optimistic "mark done" mutation.
     */
    const markDoneMutation = useMutation({
        mutationFn: (task: Task) =>
            updateTask(task.id, {
                completed: true,
            }),

        onMutate: async (task) => {
            await queryClient.cancelQueries({
                queryKey: ["tasks"],
            });

            const previousTasks =
                queryClient.getQueryData<Task[]>(["tasks"]);

            queryClient.setQueryData<Task[]>(
                ["tasks"],
                (oldTasks = []) =>
                    oldTasks.map((item) =>
                        item.id === task.id
                            ? {
                                  ...item,
                                  completed: true,
                              }
                            : item
                    )
            );

            return {
                previousTasks,
            };
        },

        onError: (_error, _task, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(
                    ["tasks"],
                    context.previousTasks
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });
        },
    });

    /*
     * Create the list of assignees from the tasks we already fetched.
     */
    const assignees = useMemo(() => {
        const values = tasks
            .map((task) => task.assignedTo)
            .filter(
                (value): value is string =>
                    Boolean(value)
            );

        return [...new Set(values)];
    }, [tasks]);

    /*
     * Search + status + assignee filtering.
     */
    const filteredTasks = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !searchValue ||
                task.title
                    .toLowerCase()
                    .includes(searchValue) ||
                (task.description || "")
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                status === "all" ||
                (status === "done" && task.completed) ||
                (status === "pending" && !task.completed);

            const matchesAssignee =
                assignee === "all" ||
                (assignee === "unassigned" &&
                    !task.assignedTo) ||
                task.assignedTo === assignee;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesAssignee
            );
        });
    }, [tasks, search, status, assignee]);

    /*
     * Pagination.
     */
    const totalPages = Math.max(
        1,
        Math.ceil(filteredTasks.length / PAGE_SIZE)
    );

    const paginatedTasks = useMemo(() => {
        const start =
            (page - 1) * PAGE_SIZE;

        return filteredTasks.slice(
            start,
            start + PAGE_SIZE
        );
    }, [filteredTasks, page]);

    /*
     * Reset to first page whenever filters change.
     */
    useEffect(() => {
        setPage(1);
    }, [search, status, assignee]);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        queryClient.clear();

        router.replace("/login");
    }

    if (!authenticated) {
        return (
            <main className="center-page">
                <div className="loading-spinner" />
                <p>Checking authentication...</p>
            </main>
        );
    }

    return (
        <main className="dashboard">
            <header className="topbar">
                <div className="brand">
                    <div className="brand-icon">✓</div>

                    <div>
                        <h1>Task Board</h1>
                        <p>Manage your work</p>
                    </div>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>
            </header>

            <section className="board">
                <div className="board-header">
                    <div>
                        <h2>Your Tasks</h2>

                        <p>
                            {tasks.length} total task
                            {tasks.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>
                </div>

                <div className="filters">
                    <input
                        className="search-input"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value
                            )
                        }
                    >
                        <option value="all">
                            All statuses
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="done">
                            Done
                        </option>
                    </select>

                    <select
                        value={assignee}
                        onChange={(event) =>
                            setAssignee(
                                event.target.value
                            )
                        }
                    >
                        <option value="all">
                            All assignees
                        </option>

                        <option value="unassigned">
                            Unassigned
                        </option>

                        {assignees.map((id) => (
                            <option
                                key={id}
                                value={id}
                            >
                                {id}
                            </option>
                        ))}
                    </select>
                </div>

                {isLoading && (
                    <div className="state-card">
                        <div className="loading-spinner" />
                        <h3>Loading tasks...</h3>
                        <p>
                            Fetching your latest
                            tasks.
                        </p>
                    </div>
                )}

                {isError && (
                    <div className="state-card error-state">
                        <div className="state-icon">
                            !
                        </div>

                        <h3>
                            Failed to load tasks
                        </h3>

                        <p>
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong."}
                        </p>

                        <button
                            className="primary-button small"
                            onClick={() =>
                                refetch()
                            }
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    filteredTasks.length ===
                        0 && (
                        <div className="state-card">
                            <div className="state-icon">
                                ✓
                            </div>

                            <h3>
                                No tasks found
                            </h3>

                            <p>
                                Try changing your
                                search or filters.
                            </p>
                        </div>
                    )}

                {!isLoading &&
                    !isError &&
                    paginatedTasks.length >
                        0 && (
                        <>
                            <div className="task-list">
                                {paginatedTasks.map(
                                    (task) => (
                                        <TaskCard
                                            key={
                                                task.id
                                            }
                                            task={
                                                task
                                            }
                                            onMarkDone={() =>
                                                markDoneMutation.mutate(
                                                    task
                                                )
                                            }
                                            updating={
                                                markDoneMutation.isPending &&
                                                markDoneMutation.variables
                                                    ?.id ===
                                                    task.id
                                            }
                                        />
                                    )
                                )}
                            </div>

                            <div className="pagination">
                                <button
                                    disabled={
                                        page === 1
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                current -
                                                1
                                        )
                                    }
                                >
                                    ← Previous
                                </button>

                                <span>
                                    Page {page} of{" "}
                                    {totalPages}
                                </span>

                                <button
                                    disabled={
                                        page ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                current +
                                                1
                                        )
                                    }
                                >
                                    Next →
                                </button>
                            </div>
                        </>
                    )}
            </section>
        </main>
    );
}

function TaskCard({
    task,
    onMarkDone,
    updating,
}: {
    task: Task;
    onMarkDone: () => void;
    updating: boolean;
}) {
    return (
        <article className="task-card">
            <div className="task-main">
                <div className="task-title-row">
                    <h3>{task.title}</h3>

                    <span
                        className={`status ${
                            task.completed
                                ? "status-done"
                                : "status-pending"
                        }`}
                    >
                        {task.completed
                            ? "Done"
                            : "Pending"}
                    </span>
                </div>

                {task.description && (
                    <p className="task-description">
                        {task.description}
                    </p>
                )}

                <div className="task-meta">
                    <span>
                        ID: {task.id}
                    </span>

                    <span>
                        {task.assignedTo
                            ? `Assignee: ${task.assignedTo}`
                            : "Unassigned"}
                    </span>
                </div>
            </div>

            {!task.completed && (
                <button
                    className="done-button"
                    onClick={onMarkDone}
                    disabled={updating}
                >
                    {updating
                        ? "Saving..."
                        : "Mark done"}
                </button>
            )}
        </article>
    );
}