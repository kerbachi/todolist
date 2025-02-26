import { Image, Text } from "react-native";
import { s } from "./header.style";
import logoImg from "../../assets/images/logo.png";

export function Header() {
  return (
    <>
      <Image style={s.img} source={logoImg} resizeMode="contain" />
      <Text style={s.subtitle}>You probably have something to do</Text>
    </>
  );
}