#include <SPI.h>
#include <WiFi101.h>
#include <DHT.h>

WiFiClient client;

#define DHTPIN 7

#define DHTTYPE DHT11

char ssid[] = "Caleb";  // your network SSID (name)

char pass[] = "delunoalcero";

int keyIndex = 0;  // your network key Index number (needed only for WEP)

int count = 0;

int status = WL_IDLE_STATUS;

WiFiServer server(80);

DHT dht(DHTPIN, DHTTYPE);

float h_limit = 0;
float t_limit = 0;

float t_dht = 0;
float h_dht = 0;



//Test Only

char serverurl[] = "http://172.20.10.15:4000/";


void setup() {

  Serial.begin(9600);  // initialize serial communication

  // attempt to connect to WiFi network:

  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    while (true)
      ;  // don't continue
  }


  while (status != WL_CONNECTED) {

    Serial.print("Attempting to connect to Network named: ");

    Serial.println(ssid);  // print the network name (SSID);

    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:

    //Wifi connection, TODO: Add password
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:

    delay(10000);
  }

  server.begin();  // start the web server on port 80

  printWiFiStatus();  // you're connected now, so print out the status

  dht.begin();

  pinMode(6, OUTPUT);
  pinMode(1, OUTPUT);
  pinMode(2, OUTPUT);

  //Test only
}





void loop() {

  count += 1;

  WiFiClient client = server.available();  // listen for incoming clients

  if (client) {  // if you get a client,

    Serial.println("new client");  // print a message out the serial port
    String currentLine = "";       // make a String to hold incoming data from the client
    while (client.connected()) {   // loop while the client's connected
      if (client.available()) {    // if there's bytes to read from the client,
        char c = client.read();    // read a byte, then
        Serial.write(c);           // print it out the serial monitor

        if (c == '\n') {  // if the byte is a newline character

          if (currentLine.length() == 0) {

            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/plain");
            client.println();

            // the content of the HTTP response follows the header:
            client.print(String(t_dht) + "/" + String(h_dht));

            // The HTTP response ends with another blank line:
            client.println();

            // break out of the while loop:
            break;
          }

          else {  // if you got a newline, then clear currentLine:
            currentLine = "";
          }

        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }


        if (currentLine.indexOf("/tem/") != -1) {
          int estado = -1;
          int idx = currentLine.indexOf("/tem/") + 5;   // Posición del primer dígito del parámetro
          estado = currentLine.substring(idx).toInt();  // Convertir la parte del parámetro a un entero
          t_limit = estado;
        }



        if (currentLine.indexOf("/hum/") != -1) {
          int estado2 = -1;
          int idx2 = currentLine.indexOf("/hum/") + 5;    // Posición del primer dígito del parámetro
          estado2 = currentLine.substring(idx2).toInt();  // Convertir la parte del parámetro a un entero
          h_limit = estado2;
        }


        if (currentLine.indexOf("/led/") != -1) {
          int estado3 = -1;
          int idx3 = currentLine.indexOf("/led/") + 5;  // Posición del primer dígito del parámetro
          estado3 = currentLine.substring(idx3).toInt();
          analogWrite(2, estado3);
        }
      }
    }

    // close the connection:

    client.stop();

    Serial.println("client disonnected");
  }

  t_dht = dht.readTemperature();
  h_dht = dht.readHumidity();


  if (t_limit > 0) {
    if (t_dht > t_limit) {
      digitalWrite(6, HIGH);
    } else {
      digitalWrite(6, LOW);
    }
  }

  if (h_limit > 0) {
    if (h_dht > h_limit) {
      digitalWrite(1, HIGH);
    } else {
      digitalWrite(1, LOW);
    }
  }

  if (count > 10) {
    // Configurar la solicitud POST a Supabase
    Serial.println("Should send the data to Supabase...");


    sendData();


    count = 0;  // Reiniciar el contador
  }

  delay(1000);
}



//Extra operations

void sendData() {
if (client.connect("172.20.10.4", 4000)) {
    Serial.println("Conectado al servidor.");
    
    // Enviar la solicitud GET
    client.println("GET /" + String(t_dht) + "/" + String(h_dht) + " HTTP/1.1");
    client.println("Host: 172.20.10.4:4000");
    client.println("Connection: close");
    client.println();
  } else {
    Serial.println("Error al conectar al servidor.");
  }

  // Esperar la respuesta del servidor
  while (client.connected()) {
    if (client.available()) {
      char c = client.read();
      Serial.print(c);
    }
  }

  // Cerrar la conexión
  client.stop();
}


void printWiFiStatus() {

  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");

  // print where to go in a browser:
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}
