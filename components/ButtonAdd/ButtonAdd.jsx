import { TouchableOpacity, Text } from "react-native";
import Dialog from "react-native-dialog";
import { s } from "./ButtonAdd.style"

export function ButtonAdd({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={s.btn}>
            <Text style={s.text} onPress={onPress}> +Add todo </Text>
        </TouchableOpacity>
    )
}