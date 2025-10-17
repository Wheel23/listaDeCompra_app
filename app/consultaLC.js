import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, Modal, TextInput, TouchableOpacity
} from "react-native";

export default function ConsultarProdutos() {
  const [produte, setProdute] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDeletar, setModalDeletar] = useState(false);
  const [produteDeletar, setProduteDeletar] = useState(null);  // armazenar id do produto para deletar
  const [produteEditar, setProduteEditar] = useState({});      // objeto para editar
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

  // Função para deletar produto pelo id
  const deletarProduto = () => {
    fetch(`${API_URL}/${produteDeletar}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
      .then(() => {
        alert('Produto deletado com sucesso!');
        setProdute(produte.filter(p => p.id !== produteDeletar));
        setModalDeletar(false);
        setProduteDeletar(null);
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao deletar Produto.');
      });
  }

  // Função para salvar alterações do produto editado
  const salvarAlteracoes = () => {
    console.log(produteEditar.codProduto)
    fetch(`${API_URL}/${produteEditar.codProduto}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produteEditar)
    })
      .then(res => res.json())
      .then(() => {
        alert('Produto editado com sucesso!');
        setModalEditar(false);
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao editar produto.');
      });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {produte.length === 0 ? (
        <Text>Nenhum produto encontrado.</Text>
      ) : (
        produte.map((p, index) => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.text}><Text style={styles.bold}>Nome Produto:</Text> {p.produto}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Descrição:</Text> {p.produto_desc}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Valor:</Text> {p.produto_price}</Text>

            <View style={styles.btnGroup}>
              <TouchableOpacity style={styles.btnEditar} onPress={() => {
                setModalEditar(true);
                setProduteEditar(p);  // passa o objeto completo para editar
              }}>
                <Text style={styles.btnText}>✏️ Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnDeletar} onPress={() => {
                setModalDeletar(true);
                setProduteDeletar(p.codProduto);  // passa o id para deletar
              }}>
                <Text style={styles.btnText}>🗑️ Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Modal para editar produto */}
      <Modal visible={modalEditar} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Produto</Text>

          <TextInput
            style={styles.input}
            value={produteEditar.produto}
            onChangeText={(texto) => setProduteEditar({ ...produteEditar, produto: texto })}
            placeholder="Produto Nome"
          />
          <TextInput
            style={styles.input}
            value={produteEditar.produto_desc}
            onChangeText={(texto) => setProduteEditar({ ...produteEditar, produto_desc: texto })}
            placeholder="Descrição"
          />
          <TextInput
            style={styles.input}
            value={produteEditar.produto_price}
            onChangeText={(texto) => setProduteEditar({ ...produteEditar, produto_price: texto })}
            placeholder="Valor"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.btnEditar} onPress={salvarAlteracoes}>
            <Text style={styles.btnText}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalEditar(false)} style={styles.btnDeletar}>
            <Text style={styles.btnText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal para confirmar deleção */}
      <Modal visible={modalDeletar} animationType="slide" transparent={true}>
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }]}>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
            <Text style={styles.modalTitle}>Tem certeza que quer excluir o produto?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
              <TouchableOpacity onPress={deletarProduto} style={[styles.btnDeletar, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.btnText}>Sim</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalDeletar(false)} style={[styles.btnCancelar, { flex: 1 }]}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnCancelar: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
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
