using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class SwitchPower : MonoBehaviour
{
    private string serverURL = "http://localhost:8080/changeChargingStatus";
    public CheckBatteryLevel CheckBatteryLevel;
    public Button switchButton;
    private void Start()
    {
        switchButton.onClick.AddListener(ChangeChargingStatus);
    }

    public void ChangeChargingStatus()
    {
        StartCoroutine(SendChargingStatus(!CheckBatteryLevel.ShouldChargeBattery));
    }

    private IEnumerator SendChargingStatus(bool charging)
    {
        ChargingStatus status = new ChargingStatus();
        status.charging = charging;

        string json = JsonUtility.ToJson(status);

        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);

        UnityWebRequest request = new UnityWebRequest(serverURL, UnityWebRequest.kHttpVerbPOST);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.ConnectionError || request.result == UnityWebRequest.Result.ProtocolError)
        {
            Debug.LogError("Error: " + request.error);
        }
    }
}

[System.Serializable]
public class ChargingStatus
{
    public bool charging;
}