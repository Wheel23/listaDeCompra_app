import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView,
         ActivityIndicator, Button, Modal, TextInput, TouchableOpacity } from "react-native";

export default function ConsultarProdutos() {
  const [produte, setProdute] = useState([]);
  const [modalEditar,setModalEditar] = useState(false);
  const [modalDeletar,setModalDeletar] = useState(false);
  const [produteDeletar,setProduteDeletar] = useState(null);
  const [produteEditar,setProduteEditar] = useState(null);
  const [loading, setLoading] = useState(true);


  const API_URL = "https://68f0ea200b966ad50034b1ff.mockapi.io/api/v1/produtos";

  useEffect(() => {
    fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        setProdute(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao conectar à API");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  const deletarProdute = () => {
    fetch(`${API_URL}?placa=${produteDeletar}`, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json",	
        "Authorization": API_KEY
      }
      
    })
    .then(res => res.json())
    .then(() => {
      alert('Veículo deletado com sucesso!');
      setProdute(produte.filter(v => v.placa !== veiculoDeletar));
      setModalDeletar(false);
      setVeiculoDeletar(null);
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao deletar veículo.');
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {produte.length === 0 ? (
        <Text>Nenhum produto encontrado.</Text>
      ) : (
        produte.map((p, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.text}><Text style={styles.bold}>Nome Produto:</Text> {p.produto}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Descricao:</Text> {p.produto_desc}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Valor:</Text> {p.produto_price}</Text>
           

            <View style={styles.btnGroup}>
              <TouchableOpacity style={styles.btnEditar} onPress={() => {setModalEditar(true); setProduteEditar(...p); alert(produteEditar)}}>
                <Text style={styles.btnText}>✏️ Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnDeletar} onPress={() => {setModalDeletar(true); setProduteDeletar(p.produto)}}>
                <Text style={styles.btnText}>🗑️ Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <Modal visible={modalEditar} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Produto</Text>

          <TextInput style={styles.input} placeholder="Produto" onChangeText={(texto)=> setProduteEditar(texto)}/>
          <TextInput style={styles.input} placeholder="Descrição"  onChangeText={(texto)=> setProduteEditar(texto)} />
          <TextInput style={styles.input} placeholder="Valor" onChangeText={(texto)=> setProduteEditar(texto)} />
          
          <TouchableOpacity style={styles.btnEditar} onPress={() => alert('Função de salvar alterações ainda não implementada')}>
            <Text style={styles.btnText}>Salvar Alterações</Text>

          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalEditar(false)} style={styles.btnDeletar}>
            <Text style={styles.btnText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={modalDeletar} animationType="slide">
        <View style={styles.modalContainer}>
         <Text style={styles.modalTitle}>Tem certeza que quer excluir Produto de nome: {produteDeletar}?</Text>
          <TouchableOpacity onPress={produteDeletar} style={styles.btnDeletar}>
            <Text>Sim</Text>
          </TouchableOpacity>

         <TouchableOpacity onPress={() => setModalDeletar(false)}>
            <Text style={styles.btnCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnCancelar:{
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 8,
    marginTop:10,
    
  },
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnEditar: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },
  btnDeletar: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
