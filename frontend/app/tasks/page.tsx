"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    getTasks,
    getUsers,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    Task,
    User,
} from "../../lib/api";

import {
    CreateTaskSchema,
} from "../../../shared/schemas/task.schema";

import {
    z,
} from "zod";


const PAGE_SIZE = 5;

type TaskFormData =
    z.infer<typeof CreateTaskSchema>;


export default function TasksPage() {

    const router = useRouter();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [assignee, setAssignee] = useState("all");
    const [page, setPage] = useState(1);

    const [authenticated, setAuthenticated] =
        useState(false);

    const [currentUser, setCurrentUser] =
        useState<User | null>(null);

    const [showCreate, setShowCreate] =
        useState(false);

    const [editingTask, setEditingTask] =
        useState<Task | null>(null);

    const [deletingTask, setDeletingTask] =
        useState<Task | null>(null);


    /* -------------------------
       Authentication
    ------------------------- */

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const storedUser =
            localStorage.getItem("user");

        if (!token) {
            router.replace("/login");
            return;
        }

        if (storedUser) {

            try {
                setCurrentUser(
                    JSON.parse(storedUser)
                );
            } catch {
                localStorage.removeItem("user");
            }
        }

        setAuthenticated(true);

    }, [router]);


    /* -------------------------
       Tasks
    ------------------------- */

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


    /* -------------------------
       Users
       Only needed for admin
    ------------------------- */

    const {
        data: users = [],
    } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        enabled:
            authenticated &&
            currentUser?.role === "admin",
    });


    /* -------------------------
       Create
    ------------------------- */

    const createMutation =
        useMutation({

            mutationFn: createTask,

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: ["tasks"],
                });

                setShowCreate(false);
            },
        });


    /* -------------------------
       Update
    ------------------------- */

    const updateMutation =
        useMutation({

            mutationFn: ({
                id,
                data,
            }: {
                id: number;
                data: Partial<
                    Pick<
                        Task,
                        | "title"
                        | "description"
                        | "completed"
                    >
                >;
            }) =>
                updateTask(id, data),

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: ["tasks"],
                });

                setEditingTask(null);
            },
        });


    /* -------------------------
       Delete
    ------------------------- */

    const deleteMutation =
        useMutation({

            mutationFn: deleteTask,

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: ["tasks"],
                });

                setDeletingTask(null);
            },
        });


    /* -------------------------
       Assign
    ------------------------- */

    const assignMutation =
        useMutation({

            mutationFn: ({
                taskId,
                userId,
            }: {
                taskId: number;
                userId: number;
            }) =>
                assignTask(
                    taskId,
                    userId
                ),

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: ["tasks"],
                });
            },
        });


    /* -------------------------
       Optimistic Mark Done
    ------------------------- */

    const markDoneMutation =
        useMutation({

            mutationFn: (task: Task) =>
                updateTask(task.id, {
                    completed: true,
                }),

            onMutate: async (task) => {

                await queryClient.cancelQueries({
                    queryKey: ["tasks"],
                });

                const previousTasks =
                    queryClient.getQueryData<Task[]>(
                        ["tasks"]
                    );

                queryClient.setQueryData<Task[]>(
                    ["tasks"],
                    (oldTasks = []) =>
                        oldTasks.map((item) =>
                            item.id === task.id
                                ? {
                                    ...item,
                                    completed:
                                        true,
                                }
                                : item
                        )
                );

                return {
                    previousTasks,
                };
            },

            onError: (
                _error,
                _task,
                context
            ) => {

                if (
                    context?.previousTasks
                ) {
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


    /* -------------------------
       Assignees
    ------------------------- */

    const assignees = useMemo(() => {

        return users.filter(
            (user) =>
                user.role === "user"
        );

    }, [users]);


    /* -------------------------
       Filtering
    ------------------------- */

    const filteredTasks = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();

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
                (status === "done" &&
                    task.completed) ||
                (status === "pending" &&
                    !task.completed);

            const matchesAssignee =
                assignee === "all" ||
                (assignee === "unassigned" &&
                    !task.assignedTo) ||
                task.assignedTo === Number(assignee);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesAssignee
            );
        });

    }, [
        tasks,
        search,
        status,
        assignee,
    ]);


    /* -------------------------
       Pagination
    ------------------------- */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredTasks.length /
                PAGE_SIZE
            )
        );

    const paginatedTasks =
        useMemo(() => {

            const start =
                (page - 1) *
                PAGE_SIZE;

            return filteredTasks.slice(
                start,
                start + PAGE_SIZE
            );

        }, [
            filteredTasks,
            page,
        ]);


    useEffect(() => {
        setPage(1);
    }, [
        search,
        status,
        assignee,
    ]);


    /* -------------------------
       Logout
    ------------------------- */

    function logout() {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        queryClient.clear();

        router.replace("/login");
    }


    if (!authenticated) {

        return (
            <main className="center-page">

                <div className="loading-spinner" />

                <p>
                    Checking authentication...
                </p>

            </main>
        );
    }


    return (
        <main className="dashboard">

            <header className="topbar">

                <div className="brand">

                    <div className="brand-icon">
                        ✓
                    </div>

                    <div>
                        <h1>
                            Task Board
                        </h1>

                        <p>
                            Manage your work
                        </p>
                    </div>

                </div>


                <div className="topbar-actions">

                    {currentUser && (
                        <span className="user-badge">
                            {currentUser.name}
                            {" · "}
                            {currentUser.role}
                        </span>
                    )}

                    <button
                        className="secondary-button"
                        onClick={() =>
                            router.push("/profile")
                        }
                    >
                        Profile
                    </button>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <section className="board">

                <div className="board-header">

                    <div>

                        <h2>
                            Tasks
                        </h2>

                        <p>
                            {tasks.length} total task
                            {tasks.length !== 1
                                ? "s"
                                : ""}
                        </p>

                    </div>


                    <button
                        className="primary-button create-button"
                        onClick={() =>
                            setShowCreate(true)
                        }
                    >
                        + New Task
                    </button>

                </div>


                <div className="filters">

                    <input
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

                        {assignees.map(
                            (user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name}
                                </option>
                            )
                        )}

                    </select>

                </div>


                {isLoading && (
                    <div className="state-card">

                        <div className="loading-spinner" />

                        <h3>
                            Loading tasks...
                        </h3>

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
                                Create a task or
                                change your filters.
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
                                            key={task.id}
                                            task={task}
                                            currentUser={
                                                currentUser
                                            }

                                            users={
                                                users
                                            }

                                            onMarkDone={() =>
                                                markDoneMutation.mutate(
                                                    task
                                                )
                                            }

                                            onEdit={() =>
                                                setEditingTask(
                                                    task
                                                )
                                            }

                                            onDelete={() =>
                                                setDeletingTask(
                                                    task
                                                )
                                            }

                                            onAssign={(
                                                userId
                                            ) =>
                                                assignMutation.mutate(
                                                    {
                                                        taskId:
                                                            task.id,
                                                        userId,
                                                    }
                                                )
                                            }

                                            updating={
                                                markDoneMutation.isPending &&
                                                markDoneMutation.variables
                                                    ?.id ===
                                                task.id
                                            }

                                            assigning={
                                                assignMutation.isPending &&
                                                assignMutation.variables
                                                    ?.taskId ===
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


            {showCreate && (
                <TaskModal
                    title="Create Task"
                    submitText="Create"
                    onClose={() =>
                        setShowCreate(false)
                    }
                    onSubmit={(
                        title,
                        description
                    ) =>
                        createMutation.mutate({
                            title,
                            description,
                        })
                    }
                    loading={
                        createMutation.isPending
                    }
                    error={
                        createMutation.error
                            ? createMutation.error
                                instanceof Error
                                ? createMutation.error.message
                                : "Failed to create task"
                            : null
                    }
                />
            )}


            {editingTask && (
                <TaskModal
                    title="Edit Task"
                    submitText="Save changes"
                    initialTitle={
                        editingTask.title
                    }
                    initialDescription={
                        editingTask.description ||
                        ""
                    }
                    onClose={() =>
                        setEditingTask(null)
                    }
                    onSubmit={(
                        title,
                        description
                    ) =>
                        updateMutation.mutate({
                            id: editingTask.id,
                            data: {
                                title,
                                description,
                            },
                        })
                    }
                    loading={
                        updateMutation.isPending
                    }
                    error={
                        updateMutation.error
                            ? updateMutation.error
                                instanceof Error
                                ? updateMutation.error.message
                                : "Failed to update task"
                            : null
                    }
                />
            )}


            {deletingTask && (
                <ConfirmModal
                    title="Delete task?"
                    message={`Are you sure you want to delete "${deletingTask.title}"?`}
                    loading={
                        deleteMutation.isPending
                    }
                    onCancel={() =>
                        setDeletingTask(null)
                    }
                    onConfirm={() =>
                        deleteMutation.mutate(
                            deletingTask.id
                        )
                    }
                />
            )}

        </main>
    );
}


/* =====================================================
   TASK CARD
===================================================== */

function TaskCard({
    task,
    currentUser,
    users,
    onMarkDone,
    onEdit,
    onDelete,
    onAssign,
    updating,
    assigning,
}: {
    task: Task;
    currentUser: User | null;
    users: User[];
    onMarkDone: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onAssign: (userId: number) => void;
    updating: boolean;
    assigning: boolean;
}) {

    const canManage =
        currentUser?.role === "admin" ||
        task.createdBy ===
        currentUser?.id ||
        task.assignedTo ===
        currentUser?.id;

    const canMarkDone =
        currentUser?.role !== "admin" &&
        (
            task.createdBy === currentUser?.id ||
            task.assignedTo === currentUser?.id
        );

    return (
        <article className="task-card">

            <div className="task-main">

                <div className="task-title-row">

                    <h3>
                        {task.title}
                    </h3>

                    <span
                        className={`status ${task.completed
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
                        Created by:{" "}
                        {task.createdBy ===
                            currentUser?.id
                            ? "You"
                            : task.createdBy}
                    </span>

                    <span>
                        {task.assignedTo
                            ? `Assigned to: ${users.find(
                                (user) =>
                                    user.id ===
                                    task.assignedTo
                            )?.name ||
                            task.assignedTo
                            }`
                            : "Unassigned"}
                    </span>

                </div>


                {currentUser?.role ===
                    "admin" && (
                        <div className="assignment-row">

                            <label>
                                Assign to:
                            </label>

                            <select
                                value={
                                    task.assignedTo ||
                                    ""
                                }
                                disabled={assigning}
                                onChange={(event) => {

                                    const userId =
                                        Number(event.target.value);

                                    if (userId) {
                                        onAssign(userId);
                                    }

                                }}
                            >

                                <option value="">
                                    Select user
                                </option>

                                {users
                                    .filter(
                                        (user) =>
                                            user.role ===
                                            "user"
                                    )
                                    .map(
                                        (user) => (
                                            <option
                                                key={
                                                    user.id
                                                }
                                                value={
                                                    user.id
                                                }
                                            >
                                                {user.name}
                                            </option>
                                        )
                                    )}

                            </select>

                        </div>
                    )}

            </div>


            {canManage && (
                <div className="task-actions">

                    {!task.completed && canMarkDone && (
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


                    <button
                        className="secondary-button"
                        onClick={onEdit}
                    >
                        Edit
                    </button>


                    <button
                        className="danger-button"
                        onClick={onDelete}
                    >
                        Delete
                    </button>

                </div>
            )}

        </article>
    );
}


/* =====================================================
   TASK MODAL
   React Hook Form + Zod
===================================================== */

function TaskModal({
    title,
    submitText,
    initialTitle = "",
    initialDescription = "",
    onClose,
    onSubmit,
    loading,
    error,
}: {
    title: string;
    submitText: string;
    initialTitle?: string;
    initialDescription?: string;
    onClose: () => void;
    onSubmit: (
        title: string,
        description: string
    ) => void;
    loading: boolean;
    error: string | null;
}) {

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<TaskFormData>({
        resolver: zodResolver(
            CreateTaskSchema
        ),

        mode: "onChange",

        defaultValues: {
            title: initialTitle,
            description: initialDescription,
        },
    });


    function submit(
        data: TaskFormData
    ) {

        onSubmit(
            data.title,
            data.description ?? ""
        );
    }


    return (
        <div className="modal-backdrop">

            <div className="modal-card">

                <div className="modal-header">

                    <h2>
                        {title}
                    </h2>

                    <button
                        className="modal-close"
                        onClick={onClose}
                        type="button"
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit(submit)}
                    className="task-form"
                >

                    <label>
                        Title
                    </label>

                    <input
                        {...register("title")}
                        placeholder="Task title"
                        autoFocus
                    />

                    {errors.title && (
                        <div className="field-error">
                            {errors.title.message}
                        </div>
                    )}


                    <label>
                        Description
                    </label>

                    <textarea
                        {...register("description")}
                        placeholder="Task description"
                        rows={5}
                    />

                    {errors.description && (
                        <div className="field-error">
                            {errors.description.message}
                        </div>
                    )}


                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}


                    <div className="modal-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                loading ||
                                !isValid
                            }
                        >
                            {loading
                                ? "Saving..."
                                : submitText}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


/* =====================================================
   CONFIRM MODAL
===================================================== */

function ConfirmModal({
    title,
    message,
    onCancel,
    onConfirm,
    loading,
}: {
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {

    return (
        <div className="modal-backdrop">

            <div className="modal-card confirm-modal">

                <div className="modal-header">

                    <h2>
                        {title}
                    </h2>

                    <button
                        className="modal-close"
                        onClick={onCancel}
                        type="button"
                    >
                        ×
                    </button>

                </div>


                <p className="confirm-message">
                    {message}
                </p>


                <div className="modal-actions">

                    <button
                        className="secondary-button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="danger-button"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}