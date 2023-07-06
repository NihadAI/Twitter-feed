class Card {
    constructor(post) {
      this.post = post;
    }

    createCard() {
      const card = document.createElement('div');
      card.classList.add('card');

      const title = document.createElement('h2');
      title.classList.add('card-title');
      title.textContent = this.post.title;
      card.appendChild(title);

      const content = document.createElement('p');
      content.classList.add('card-content');
      content.textContent = this.post.body;
      card.appendChild(content);

      const user = document.createElement('p');
      user.classList.add('card-user');
      user.textContent = `Posted by: ${this.post.user.firstName} ${this.post.user.lastName} (${this.post.user.email})`;
      card.appendChild(user);

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => this.deleteCard());
      card.appendChild(deleteButton);

      return card;
    }

    deleteCard() {
      fetch(`https://ajax.test-danit.com/api/json/posts/${this.post.id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            const feed = document.getElementById('feed');
            const card = document.getElementById(`card-${this.post.id}`);
            feed.removeChild(card);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  async function fetchData() {
    try {
      const userResponse = await fetch('https://ajax.test-danit.com/api/json/users');
      const userData = await userResponse.json();

      const postResponse = await fetch('https://ajax.test-danit.com/api/json/posts');
      const postData = await postResponse.json();

      displayPosts(postData, userData);
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  function displayPosts(posts, users) {
    const feed = document.getElementById('feed');

    posts.forEach(post => {
      const user = users.find(user => user.id === post.userId);
      post.user = user;

      const card = new Card(post);
      const cardElement = card.createCard();
      cardElement.id = `card-${post.id}`;
      feed.appendChild(cardElement);
    });
  }

  fetchData();