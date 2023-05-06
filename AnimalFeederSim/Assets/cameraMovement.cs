using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class cameraMovement : MonoBehaviour
{
    private Vector3 cameraPosition;
    private float cameraScale;

    private const float scaleMultiplier = -10;
    // Start is called before the first frame update
    void Start()
    {
        cameraPosition = transform.position;
        cameraScale = GetComponent<Camera>().orthographicSize;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetMouseButton(0))
        {
            cameraPosition -= new Vector3(Input.GetAxis("Mouse X"), Input.GetAxis("Mouse Y"), 0);
            transform.position = cameraPosition;
        }
        cameraScale += scaleMultiplier * Input.GetAxis("Mouse ScrollWheel");
        cameraScale = Mathf.Clamp(cameraScale, 0.1f, 100f);
        GetComponent<Camera>().orthographicSize = cameraScale;
    }
}
