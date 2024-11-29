import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTTComponent = () => {
  const [messages, setMessages] = useState([]);
  const brokerUrl = "ws://broker.hivemq.com:8000/mqtt"; // URL do broker MQTT (Ex.: HiveMQ)

  useEffect(() => {
    // Conectar ao broker MQTT
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      console.log("Conectado ao broker MQTT");

      // Subscribir-se a um tópico
      client.subscribe("meu/topico", (err) => {
        if (!err) {
          console.log("Inscrito no tópico: meu/topico");
        }
      });
    });

    // Escutar mensagens no tópico
    client.on("message", (topic, message) => {
      console.log(`Mensagem recebida: ${message.toString()}`);
      setMessages((prev) => [...prev, message.toString()]);
    });

    // Cleanup na desconexão
    return () => {
      client.end();
    };
  }, [brokerUrl]);

  return (
    <div>
      <h2>Mensagens do Tópico</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default MQTTComponent;
