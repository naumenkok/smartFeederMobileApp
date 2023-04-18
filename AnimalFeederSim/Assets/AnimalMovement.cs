using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AnimalMovement : MonoBehaviour
{
    public float moveSpeed = 3f;
    public float moveRange = 30f;
    private bool facingRight = true;

    private Vector3 moveDirection;
    // Start is called before the first frame update
    void Start()
    {
        float randomX = Random.Range(-moveRange, moveRange);
        transform.position = new Vector2(randomX, transform.position.y);
    }

    // Update is called once per frame
    void Update()
    {
        float moveDirection = facingRight ? 1 : -1;
        transform.Translate(moveDirection * moveSpeed * Time.deltaTime, 0, 0);

        if (transform.position.x >= moveRange && facingRight)
        {
            Flip();
        }
        else if (transform.position.x <= -moveRange && !facingRight)
        {
            Flip();
        }
    }
    void Flip()
    {
        facingRight = !facingRight;
        Vector3 flipped = transform.localScale;
        flipped.x *= -1;
        transform.localScale = flipped;
    }
}