import { Element } from "./lib/Element";
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
        .child(TodoForm({ onSubmit: onNewTodoCreate }))
    )
    .child(TodosList({ todos: todosStore }));
};

interface TodoFormProps {
  onSubmit: (event: SubmitEvent) => void;
}

const TodoForm = (props: TodoFormProps) => {
  return Element("form")
    .child(Element("input").attribute("placeholder", "Your todo..."))
    .child(Element("button").attribute("type", "submit").child("Create"))
    .listen("submit", props.onSubmit);
};

interface TodosListProps {
  todos: TodoState;
}

const TodosList = (props: TodosListProps) => {
  return Element("div", props.todos).forEachChild(
    () => props.todos.todos,
    (todo, index) => TodoItem({ todo, index })
  );
};

interface TodoItemProps {
  todo: Todo;
  index: number;
}

const TodoItem = (props: TodoItemProps) => {
  const { todo, index } = props;

  const isEditModeEnabledState = state({ isEditMode: false });

  return Element("div").child(() => `${todo.description}`);
};

export const App = () => {
  return Element("div", userStore)
    .styles({
      width: "100dvw",
      height: "100dvh",
    })
    .child(() => (userStore.user ? UserTodosScreen() : WelcomeScreen()));
};
