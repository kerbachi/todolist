import { Image, Text, TouchableOpacity } from "react-native";
import { s } from "./cardtodo.style";
import checkImg from "../../assets/images/check.png";


export function CardTodo({ todo, onPress, onLongPress }) {
  return (
    <TouchableOpacity style={s.card} onLongPress={() => onLongPress(todo)} onPress={() => onPress(todo)}>
      <Text
        style={[
          s.title,
          todo.isCompleted && { textDecorationLine: "line-through" },
        ]}
      >
        {todo.title}
      </Text>
      {todo.isCompleted && <Image style={s.img} source={checkImg} />}
    </TouchableOpacity>
  );
}
