using System;
using TMPro;
using UnityEngine;

public class TimeHandler : MonoBehaviour
{
    public TimeSpan gameStartTime = new TimeSpan(7,0,0);
    public TimeSpan gameTimeSpan;
    public TextMeshProUGUI timeText;
    public float secondsPerGameHour = 60f;

    // Start is called before the first frame update
    void Start()
    {
    }

    // Update is called once per frame
    void Update()
    {
		gameTimeSpan = gameStartTime + TimeSpan.FromMinutes(Time.time*60/secondsPerGameHour);
        string formattedTime = gameTimeSpan.ToString("hh':'mm");
        timeText.text = formattedTime;    
	}
}