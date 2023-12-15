import { Element } from "./lib//elements/Element";
import { state } from "./lib/state";

interface Todo {
  description: string;
}

interface TodoState {
  todos: Todo[];
}

interface User {
  username: string;
}

const userStore = state<{ user: User | null }>({ user: null });

const WelcomeScreen = () => {
  const loginStore = state({ username: "" });

  const signin = () => {
    if (loginStore.username) {
      userStore.user = { username: loginStore.username };
    }
  };

  return Element("div")
    .styles({
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "10px",
    })
    .child(
      Element("input").listen(
        "input",
        (event) => (loginStore.username = event.target.value)
      )
    )
    .child(Element("button").listen("click", signin).child("Sign in"));
};

const UserTodosScreen = () => {
  const todosStore = state<TodoState>({ todos: [] });

  const logout = () => {
    userStore.user = null;
  };

  const onNewTodoCreate = (event: SubmitEvent) => {
    event.preventDefault();
    todosStore.todos = [
      ...todosStore.todos,
      { description: event.target[0].value },
    ];
  };

  return Element("div")
    .child(
      Element("div")
        .child(
          Element("h3", userStore).child(
            () => `Welcome back ${userStore.user!.username}`
          )
        )
        .child(Element("button").listen("click", logout).child("Sign out"))
    )
    .child(
      Element("div", todosStore)
        .child(
          Element("h4").child(
            () => `Create new todo ${todosStore.todos.length}`
          )
        )
        .child(TodoForm(onNewTodoCreate))
    )
    .child(TodosList(todosStore));
};

const TodoForm = (
  onSubmit: (event: SubmitEvent) => void,
  initialValue = ""
) => {
  return Element("form")
    .child(
      Element("input")
        .attribute("value", initialValue)
        .attribute("placeholder", "Your todo...")
    )
    .child(Element("button").attribute("type", "submit").child("Create"))
    .listen("submit", onSubmit);
};

const TodosList = (state: TodoState) => {
  return Element("div", state).forEachChild(
    () => state.todos,
    (todo, index) => TodoItem(todo, index, state)
  );
};

const TodoItem = (todo: Todo, index: number, todoState: TodoState) => {
  const isEditModeEnabledState = state({ isEditMode: false });

  const toggleEditMode = () =>
    (isEditModeEnabledState.isEditMode = !isEditModeEnabledState.isEditMode);

  const onTodoUpdate = (event: SubmitEvent) => {
    const updatedTodo = event.target[0].value;
    todoState.todos = todoState.todos.map((todo, i) =>
      i === index ? { description: updatedTodo } : todo
    );
  };

  const onTodoDelete = () => {
    todoState.todos = todoState.todos.filter((_, i) => i !== index);
  };

  return Element("div", isEditModeEnabledState)
    .child(() =>
      isEditModeEnabledState.isEditMode
        ? TodoForm(onTodoUpdate, todo.description).child(
            Element("button").listen("click", toggleEditMode).child("Cancel")
          )
        : Element("div").child(() => `${todo.description}`)
    )
    .child(Element("button").listen("click", toggleEditMode).child("Edit"))
    .child(Element("button").listen("click", onTodoDelete).child("Delete"));
};

export const App = () => {
  return Element("div", userStore)
    .styles({
      width: "100dvw",
      height: "100dvh",
    })
    .child(() => (userStore.user ? UserTodosScreen() : WelcomeScreen()));
};
