const products = [
    { id: 1, name: 'Beng-Beng', price: 2500, img: 'img/beng-beng.webp' },
    { id: 2, name: 'Cocolatos', price: 1000, img: 'img/cocolatos.jpg' },
    { id: 3, name: 'Popcorn', price: 2000, img: 'img/popcron.jpg' },
    { id: 4, name: 'Teh Pucuk', price: 5000, img: 'img/teh pucuk.jpg' },
    { id: 5, name: 'Kusuka', price: 8500, img: 'img/kusuka.jpg' },
    { id: 6, name: 'Qtela', price: 2000, img: 'img/qtela.jpg' }
];

let cart = [];

const formatRupiah = (angka) =>
    'Rp ' + angka.toLocaleString('id-ID');

// Menampilkan produk
function displayProducts() {
    const productsContainer = document.getElementById('products');

    if (!productsContainer) {
        console.error('Elemen #products tidak ditemukan di HTML.');
        return;
    }

    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        const image = document.createElement('img');
        image.src = product.img;
        image.alt = product.name;

        image.onerror = function () {
            console.error('Gambar tidak ditemukan:', product.img);
            this.onerror = null;
            this.removeAttribute('src');
            this.alt = 'Gambar tidak tersedia';
            this.style.backgroundColor = '#141414';
        };

        const name = document.createElement('h3');
        name.textContent = product.name;

        const price = document.createElement('p');
        price.textContent = formatRupiah(product.price);

        const button = document.createElement('button');
        button.textContent = 'Tambah ke keranjang';
        button.addEventListener('click', () => {
            addToCart(product.id);
        });

        productDiv.append(image, name, price, button);
        productsContainer.appendChild(productDiv);
    });
}

// Menambahkan produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// Menampilkan isi keranjang dan total
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    cartItemsContainer.innerHTML = '';

    let totalPrice = 0;

    cart.forEach(item => {
        const listItem = document.createElement('li');

        listItem.textContent =
            `${item.name} x ${item.quantity} = ${
                formatRupiah(item.price * item.quantity)
            }`;

        cartItemsContainer.appendChild(listItem);

        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.textContent = formatRupiah(totalPrice);
}

// Checkout dan pembayaran
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang belanja masih kosong!');
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const payment = prompt(
        `Total belanja: ${formatRupiah(total)}\n` +
        'Masukkan jumlah uang pembayaran (angka saja):'
    );

    if (payment === null || payment.trim() === '') {
        return;
    }

    const paymentAmount = Number(payment);

    if (!Number.isSafeInteger(paymentAmount) || paymentAmount < 0) {
        alert('Masukkan pembayaran berupa angka bulat yang valid.');
        return;
    }

    if (paymentAmount < total) {
        alert(
            `Uang tidak cukup!\n` +
            `Total belanja: ${formatRupiah(total)}\n` +
            `Kekurangan: ${formatRupiah(total - paymentAmount)}`
        );
        return;
    }

    const change = paymentAmount - total;

    alert(
        'PEMBAYARAN BERHASIL!\n\n' +
        `Total belanja: ${formatRupiah(total)}\n` +
        `Uang pembayaran: ${formatRupiah(paymentAmount)}\n` +
        `Kembalian: ${formatRupiah(change)}\n\n` +
        'Terima kasih telah berbelanja!'
    );

    cart = [];
    updateCart();
}

// Tombol checkout
document.getElementById('checkout-btn')
    .addEventListener('click', checkout);

// Jalankan program saat halaman siap
displayProducts();
updateCart();