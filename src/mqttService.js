import mqtt from "mqtt";

const brokerUrl = "ws://broker.hivemq.com:8000/mqtt"; // URL do broker MQTT
const client = mqtt.connect(brokerUrl);

// Conexão ao broker
client.on("connect", () => {
  console.log("Conectado ao broker MQTT");
});

// Tratamento de erro
client.on("error", (err) => {
  console.error("Erro na conexão MQTT:", err);
});

// Publicar mensagem em um tópico
export const publishMessage = (topic, message) => {
  if (client.connected) {
    client.publish(topic, message, (err) => {
      if (err) {
        console.error("Erro ao publicar mensagem:", err);
      } else {
        console.log(`Mensagem publicada no tópico ${topic}: ${message}`);
      }
    });
  } else {
    console.error("Cliente MQTT desconectado. Não é possível publicar mensagens.");
  }
};

// Subscribir-se a um tópico
export const subscribeToTopic = (topic) => {
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Inscrito no tópico: ${topic}`);
    } else {
      console.error("Erro ao se inscrever no tópico:", err);
    }
  });
};

// Escutar mensagens
export const listenToMessages = (callback) => {
  client.on("message", (topic, message) => {
    callback(topic, message.toString());
  });
};
