let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById('toy-collection');

 
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  toyForm.addEventListener("submit", event => {
    event.preventDefault(); 

    const toyName = toyForm.querySelector("input[name='name']").value;
    const toyImage = toyForm.querySelector("input[name='image']").value;


    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0 
  };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newToy),
    })
    .then(response => response.json())
    .then(data => {

      console.log('New toy added:', data);

      const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');

            const toyNameElement = document.createElement('h2');
            toyNameElement.textContent = data.name;

            const toyImageElement = document.createElement('img');
            toyImageElement.classList.add('toy-avatar');
            toyImageElement.src = data.image;

            const likesCountElement = document.createElement('p');
            likesCountElement.textContent = `Likes: ${data.likes}`;

            const likeBtnElement = document.createElement('button');
            likeBtnElement.classList.add('like-btn');
            likeBtnElement.dataset.toyId = data.id; 
            likeBtnElement.textContent = 'Like';


            cardDiv.appendChild(toyNameElement);
            cardDiv.appendChild(toyImageElement);
            cardDiv.appendChild(likesCountElement);
            cardDiv.appendChild(likeBtnElement);

            toyCollection.appendChild(cardDiv);

            toyForm.reset();
        })
        .catch(error => {
          console.error('Error adding new toy:', error);
      });
  });

  fetchToys();
});



  function fetchToys() {
    fetch('http://localhost:3000/toys') 
        .then(response => response.json())
        .then(data => {
            const toyCollection = document.getElementById('toy-collection');
            data.forEach(toy => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');

            const toyName = document.createElement('h2');
                toyName.textContent = toy.name;

                const toyImage = document.createElement('img');
                toyImage.classList.add('toy-avatar');
                toyImage.src = toy.image;

               const likesCount = document.createElement('p');
              likesCount.textContent = `Likes: ${toy.likes}`;

              const likeBtn = document.createElement('button');
                likeBtn.classList.add('like-btn');
                likeBtn.id = toy.id;
                likeBtn.textContent = 'Like';

likeBtn.addEventListener("click", event => {
  if (event.target.classList.contains("like-btn")) {
      
      const likesCountElement = event.target.parentElement.querySelector('p');
      const currentLikes = parseInt(likesCountElement.textContent.split(":")[1].trim());

      const newLikes = currentLikes + 1;

      likesCountElement.textContent = `Likes: ${newLikes}`;


      fetch(`http://localhost:3000/toys/${toy.id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ likes: newLikes }),  
          })
          
          .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update toy');
            }
            return response.json();
        })
        .then(updatedToy => {
            const toyCard = event.target.parentElement;
            toyCard.querySelector('h2').textContent = updatedToy.name;
            toyCard.querySelector('img').src = updatedToy.image;
            likesCountElement.textContent = `Likes: ${updatedToy.likes}`;
        })
        .catch(error => {
            console.error('Error updating toy:', error);
            likesCountElement.textContent = `Likes: ${currentLikes}`;
        });
    }
});
                cardDiv.appendChild(toyName);
                cardDiv.appendChild(toyImage);
                cardDiv.appendChild(likesCount);
                cardDiv.appendChild(likeBtn);


            toyCollection.appendChild(cardDiv);
          });
      })
      .catch(error => {
          console.error('Error fetching toys:', error);
      });
  }

  