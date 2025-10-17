import React, { useState } from "react";
import { Picker, View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { ActivityIndicator } from "react-native-web";


export default function App() {
 const [produto, setProduto] = useState("");
 const [produtoValor, setProdutoValor] = useState("");
 const [produtoQtd, setProdutoQtd] = useState("");
 const [produtoDescricao, setProdutoDescricao] = useState("");
 const [carregando, setCarregando] = useState(false);

  const handleCadastrar = () => {
    console.log(produto, produtoValor, produtoQtd, produtoDescricao);
    if (!produto || !produtoValor ) {
      alert("Atenção", "Preencha todos os campos!");
      return;
    }
    setCarregando(true);

    const novoProduto = {
        produto: produto,
        valor: parseFloat(produtoValor),
        quantidade: parseInt(produtoQtd),
        descricao: produtoDescricao,
    };

    fetch("https://68f0ea200b966ad50034b1ff.mockapi.io/api/v1/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoProduto),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Produto cadastrado com sucesso!");
        setCarregando(false);
        setProduto("");
        setProdutoValor("");
        setProdutoDescricao("");
      })
      .catch(err => {
        console.error(err);
        alert("Erro", "Não foi possível conectar à API.");
      });
  };

  if(carregando){
    return(
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
   
        <Picker
          selectedValue={produto}
          onValueChange={itemValue => setProduto(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Selecione o Produto" value="" />
            <Picker.Item label="Salsichas" value="Sausages" />
            <Picker.Item label="Pizza Congelada" value="Pizza" />
            <Picker.Item label="Peixe" value="Fish" />
            <Picker.Item label="Queijo" value="Cheese" />
            <Picker.Item label="Batatas" value="Chips" />
            <Picker.Item label="Salada" value="Salad" />
            <Picker.Item label="Bacon" value="Bacon" />

        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
                    inputMode="numeric"
          value={produtoQtd}
          onChangeText={setProdutoQtd}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Valor"
          keyboardType="numeric"
          inputMode="numeric"
          value={produtoValor}
          onChangeText={setProdutoValor}
        />

       

        <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
