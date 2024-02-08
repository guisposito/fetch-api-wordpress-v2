function getWpPosts(){
    fetch('https://datlo.com/blog/wp-json/wp/v2/posts?per_page=8')
    .then(response => response.json())
    .then(posts => {
      posts.forEach(post => {
        Promise.all([
          getCategoryDetails(post.categories[0]),
          getImgDetails(post.featured_media)
        ]).then(([categoryDetails, imageDetails]) => {
          post.categoryName = categoryDetails.name;
          post.categoryUrl = categoryDetails.url;
          post.imageUrl = imageDetails.url;
          post.imageAltText = imageDetails.altText;
  
          displayPosts(post);
        }).catch(error => console.error('Erro ao obter detalhes adicionais: ', error));
      });
    })
    .catch(error => console.error('Erro ao obter os posts: ', error));
  }
  function getImgDetails(imgURLId){
    return fetch(`https://datlo.com/blog/wp-json/wp/v2/media/${imgURLId}`)
    .then(response => response.json())
    .then(image => ({
      url: image.source_url,
      altText: image.alt_text
    }))
    .catch(error => {
      console.error('Erro ao obter o URL da imagem', error);
      return '/assets/imgs/page/about/default-img.jpg'
    })
  }
  function getCategoryDetails(categoryId){
    return fetch(`https://datlo.com/blog/wp-json/wp/v2/categories/${categoryId}`)
    .then(response => response.json())
    .then(category => ({
      url: category.link,
      name: category.name
    }))
    .catch(error => {
        console.error('Erro ao obter o nome da categoria: ', error);
        return {url: '#' , name:'Sem categoria'};
    });
  }
  function displayPosts(post){
    const body = document.querySelector('.wp-blogposts');
    const excerpt = post.excerpt && post.excerpt.rendered ? post.excerpt.rendered : 'Não há resumo disponível';
    const category = post.categoryName || 'Sem categoria';
    const date = new Date(post.date).toLocaleDateString();
    const imgURL = post.imageUrl || '/assets/imgs/page/about/default-img.jpg';
    const imageAltText = post.imageAltText || 'Imagem da postagem';
  
    body.insertAdjacentHTML('beforeend',`
      <div class="card-post col-md-3 mb-20">
        <a href="${post.link}" target="_blank">
          <img class="post-img rounded-2 mb-5" width="369" height="220" src="${imgURL}" alt="${imageAltText}">
          <h3 class="title-post col-sm-9 mb-20">${post.title.rendered}</h3>
        </a>
        <div class="excerpt-post col-sm-9 mb-20">${excerpt}</div>
        <span class="mr-20"><a href="${post.categoryUrl}">${category}</a></span>
        <span>${date}</span>
      </div>
    `);
  }