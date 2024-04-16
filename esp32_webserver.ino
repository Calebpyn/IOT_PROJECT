/////////////////////////////////////////////////////////////////
//         ESP32 Web Server Project  v1.00                     //
//       Get the latest version of the code here:              //
//         http://educ8s.tv/esp32-web-server                   //
/////////////////////////////////////////////////////////////////


#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>  //https://github.com/bbx10/WebServer_tng
#include <Adafruit_BMP085.h>

#include <HTTPClient.h>

WebServer server(80);

const char* ssid = "Caleb";
const char* password = "delunoalcero";

const char* supabaseEndpoint = "https://pmvkjhoxsepoqquuwada.supabase.co/rest/v1/bmp_data";                                                                                                                                                    // Reemplaza con tu subdominio y nombre de tabla
const char* supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdmtqaG94c2Vwb3FxdXV3YWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMTM1NzMsImV4cCI6MjAyODY4OTU3M30.cri1tY-kWYlOlQl1kWQo23CQoj-zRkGcg94TGglYJnU";  // Reemplaza con tu API Key de Supabase

int LEDPIN = 32;

int count = 0;

int LEDPINT = 26;
int LEDPINP = 27;

int t_limit = 0;
int p_limit = 0;

float temperature = 0;
float humidity = 0;
float pressure = 0;

String ledState = "OFF";

Adafruit_BMP085 bmp;

void setup() {
  Serial.print("\033[2J");

  pinMode(LEDPIN, OUTPUT);
  pinMode(LEDPINT, OUTPUT);
  pinMode(LEDPINP, OUTPUT);

  Serial.begin(115200);

  initSensor();

  connectToWifi();

  beginServer();
}

void loop() {

  count += 1;

  server.handleClient();

  getData();

  if (temperature > t_limit) {
    digitalWrite(LEDPINT, HIGH);
  } else {
    digitalWrite(LEDPINT, LOW);
  }

  if (pressure > p_limit) {
    digitalWrite(LEDPINP, HIGH);
  } else {
    digitalWrite(LEDPINP, LOW);
  }

  delay(1);
}

void connectToWifi() {
  WiFi.enableSTA(true);

  delay(2000);


  //Wifi connection, TODO: Add password
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}




void handleRoot() {
  if (server.hasArg("LED")) {
    handleSubmit();
  } else {
    server.send(200, "text/html", getPage());
  }
}

void initSensor() {
  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP085/BMP180 sensor, check wiring!");
    while (1) {}
  }
}

void getData() {

  temperature = bmp.readTemperature();

  pressure = (bmp.readPressure()) / 100;


  if (count > 300) {
    sendToSupabase();

    Serial.print("Temperature = ");

    Serial.print(temperature);
    Serial.println(" *C");

    Serial.print("Pressure = ");

    Serial.print(pressure);
    Serial.println(" Pa");

    count = 0;
  }

  // // Calculate altitude assuming 'standard' barometric
  // // pressure of 1013.25 millibar = 101325 Pascal
  // Serial.print("Altitude = ");
  // Serial.print(bmp.readAltitude());
  // Serial.println(" meters");

  // Serial.print("Pressure at sealevel (calculated) = ");
  // Serial.print(bmp.readSealevelPressure());
  // Serial.println(" Pa");

  // // you can get a more precise measurement of altitude
  // // if you know the current sea level pressure which will
  // // vary with weather and such. If it is 1015 millibars
  // // that is equal to 101500 Pascals.
  // Serial.print("Real altitude = ");
  // Serial.print(bmp.readAltitude(102000));
  // Serial.println(" meters");

  // Serial.println();
}

void handleSubmit() {

  String LEDValue;
  LEDValue = server.arg("LED");
  Serial.println("Set GPIO ");
  Serial.print(LEDValue);

  if (LEDValue == "1") {
    digitalWrite(LEDPIN, HIGH);
    ledState = "On";
    server.send(200, "text/html", getPage());
  } else if (LEDValue == "0") {
    digitalWrite(LEDPIN, LOW);
    ledState = "Off";
    server.send(200, "text/html", getPage());
  } else {
    Serial.println("Error Led Value");
  }
}

String getPage() {
  String page = "<html lang=en-EN><head><meta http-equiv='refresh' content='60'/>";
  page += "<title>ESP32 WebServer - educ8s.tv</title>";
  page += "<style> body { background-color: #fffff; font-family: Arial, Helvetica, Sans-Serif; Color: #000000; }</style>";
  page += "</head><body><h1>ESP32 WebServer</h1>";


  page += "</body></html>";
  return page;
}

void beginServer() {
  server.on("/", handleRoot);
  server.on("/print", HTTP_GET, handlePrint);  // Configurar la ruta para handlePrint
  server.on("/led", HTTP_GET, handleLed);
  server.on("/tem", HTTP_GET, handleTemp);
  server.on("/pres", HTTP_GET, handlePress);
  server.begin();
  Serial.println("HTTP server started");
}

void handlePrint() {
  if (server.hasArg("value")) {
    String value = server.arg("value");  // Obtener el valor del parámetro "value"
    int intValue = value.toInt();        // Convertir el valor a entero
    Serial.print("Valor recibido: ");
    Serial.println(intValue);                                    // Imprimir el valor entero
    server.send(200, "text/plain", "Valor recibido: " + value);  // Responder con el valor recibido
  } else {
    server.send(400, "text/plain", "Error: No se proporcionó ningún valor en el path.");  // Si no se proporcionó ningún valor en el path
  }
}

void handleLed() {
  if (server.hasArg("value")) {
    String value = server.arg("value");  // Obtener el valor del parámetro "value"
    int intValue = value.toInt();        // Convertir el valor a entero
    analogWrite(LEDPIN, intValue);
    server.send(200, "text/plain", "OK");
  } else {
    server.send(400, "text/plain", "Error: No se proporcionó ningún valor en el path.");  // Si no se proporcionó ningún valor en el path
  }
}


void handleTemp() {
  if (server.hasArg("value")) {
    String value = server.arg("value");  // Obtener el valor del parámetro "value"
    int intValue = value.toInt();        // Convertir el valor a entero
    t_limit = intValue;
    server.send(200, "text/plain", "OK");
  } else {
    server.send(400, "text/plain", "Error: No se proporcionó ningún valor en el path.");  // Si no se proporcionó ningún valor en el path
  }
}

void handlePress() {
  if (server.hasArg("value")) {
    String value = server.arg("value");  // Obtener el valor del parámetro "value"
    int intValue = value.toInt();        // Convertir el valor a entero
    p_limit = intValue;
    server.send(200, "text/plain", "OK");
  } else {
    server.send(400, "text/plain", "Error: No se proporcionó ningún valor en el path.");  // Si no se proporcionó ningún valor en el path
  }
}

void sendToSupabase() {
  // Crear el JSON con los datos a enviar
  String jsonPayload = "{\"bmp_t\": " + String(temperature) + ", \"bmp_p\": " + String(pressure) + "}";

  // Inicializar la solicitud HTTP
  HTTPClient http;
  http.begin(supabaseEndpoint);

  // Agregar encabezados a la solicitud
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabaseKey);

  // Realizar la solicitud POST con el JSON como cuerpo de la solicitud
  int httpResponseCode = http.POST(jsonPayload);

  // Verificar si la solicitud fue exitosa
  if (httpResponseCode > 0) {
    Serial.print("Solicitud POST exitosa. Código de respuesta: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Error en la solicitud POST. Código de respuesta: ");
    Serial.println(httpResponseCode);
  }

  // Liberar recursos
  http.end();
}
