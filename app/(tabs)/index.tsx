import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

const STORAGE_KEY = "@nomes_v1";

type ItemNome = {
  id: number;
  nome: string;
  telefone: string;
};

export default function Home() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomes, setNomes] = useState<ItemNome[]>([]);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setNomes(JSON.parse(data));
      }
    } catch (error) {
      Alert.alert("Erro", "Não carregou.");
    }
  };

  const salvar = async () => {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert("Digite um nome e um telefone");
      return;
    }

    const novaLista = [...nomes, { id: Date.now(), nome, telefone }];
    setNomes(novaLista);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
      setNome("");
      setTelefone("");
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert("Erro", "Não salvo.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cadastro de Nomes</Text>

      <TextInput
        placeholder="Digite um nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput 
        placeholder="Digite o telefone"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
      />


      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <FlatList
        data={nomes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.nome} - {item.telefone}</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: { color: "#fff", textAlign: "center" },
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
});