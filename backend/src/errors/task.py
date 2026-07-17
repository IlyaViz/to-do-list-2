class TaskError(Exception):
    """Base task domain error."""


class TaskNotFoundError(TaskError):
    """Raised when a task does not exist or belongs to another user."""


class MaxDepthExceededError(TaskError):
    """Raised when attempting to nest a subtask under another subtask."""
