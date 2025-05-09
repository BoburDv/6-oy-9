import { Button } from "@/components/ui/button";
import { fetchData, deleteData, addData } from "./requests";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useEffect, useReducer } from "react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"


const initialState = {
  todos: [],
  error: null,
  selectFilter: "all",
  newTodo: "",
  openModal: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "success":
      return { ...state, todos: action.payload };
    case "error":
      return { ...state, error: action.payload };
    case "filter":
      return { ...state, selectFilter: action.payload };
    case "addData":
      return { ...state, todos: [...state.todos, action.payload], newTodo: "", openModal: false };
    case "deleteData":
      return { ...state, todos: state.todos.filter((el) => el.id !== action.payload) };
    case "set_newData":
      return { ...state, newTodo: action.payload };
    case "toggle_modal":
      return { ...state, openModal: !state.openModal };
    default:
      return state;
  }
}
const skeletonArray = [1, 2, 3, 4, 5, 6, 7];


export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchData()
      .then((res) => dispatch({ type: "success", payload: res.data }))
      .catch((err) => dispatch({ type: "error", payload: err.message }));
  }, []);


  const handleAdd = () => {
    if (!state.newTodo) {
      toast.error("Ma'lumot kiritilmadi!");
      return;
    }
    addData({ title: state.newTodo, priority: "medium" })
      .then((res) => {
        dispatch({
          type: "addData",
          payload: res.data,
        });
      })
    toast.success("Ma'lumot qo'shildi");
  };

  const handleDelete = (id) => {
    deleteData(id)
      .then(() => {
        dispatch({
          type: "deleteData",
          payload: id,
        });
      })
    toast.success("Ma'lumot o'chirildi!");
  };

  const filtered = state.selectFilter !== "all" ? state.todos.filter((el) => el.priority == state.selectFilter) : state.todos;

  return (
    <div className="max-w-2xl mx-auto w-full mt-10">
      <div className="flex justify-between shadow-sm p-2.5 rounded-lg">
        <h2 className="text-3xl text-gray-700 font-medium">Todo app</h2>
        <div className="flex gap-4">
          <Select onValueChange={(value) => dispatch({ type: "filter", payload: value })}>
            <SelectTrigger className="w-[135px]">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <AlertDialog open={state.openModal} onOpenChange={() => dispatch({ type: "toggle_modal" })}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Add</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ma'lumot qo'shish</AlertDialogTitle>
                <Input
                  type="text"
                  placeholder="Matn kiritig.."
                  value={state.newTodo}
                  onChange={(e) => dispatch({ type: "set_newData", payload: e.target.value })}
                />
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => dispatch({ type: "toggle_modal" })}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAdd}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div>
        {filtered.length ? (
          filtered.map((el) => (
            <div key={el.id} className="flex my-5 justify-between shadow-sm p-2.5 items-center rounded-lg">
              <div className="flex gap-3">
                <p>{el.id}</p>
                <p>{el.title}</p>
              </div>
              <div>
                <Badge variant="outline">{el.priority}</Badge>
                <Button onClick={() => handleDelete(el.id)} className="ml-6">X</Button>
              </div>
            </div>
          ))
        ) : (
          <div>
            {skeletonArray.map((item, index) => (
              <Skeleton key={index} className="w-full h-[55px] rounded-lg my-6" />
            ))}
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
}