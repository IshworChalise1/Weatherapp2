<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include_once('database.php');

$currentHour = date('H');

$city = isset($_GET["city"]) ? $_GET['city'] : "rewa";
$response = file_get_contents("https://api.openweathermap.org/data/2.5/weather?units=metric&q=$city&appid=3de8383bdd37971ea2826beb54abb095");

echo $response;

$conn = create_db();

$result = $conn->query("SELECT timestamp FROM weather_data ORDER BY id DESC LIMIT 1");

if (!$result || $result->num_rows === 0) {
    insert_data($response);
} else {
    $row = $result->fetch_assoc();
    $lastTimestamp = strtotime($row['timestamp']);
    $currentTimestamp = time();

    // Check if 24 hours have passed
    if (($currentTimestamp - $lastTimestamp) >= 24 * 60 * 60) {
        insert_data($response);
    }

    $result->free();
}

$conn->close(); // Close database connection