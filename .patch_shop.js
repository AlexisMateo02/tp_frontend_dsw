const fs = require('fs');
const p = 'C:/Users/santi/OneDrive/Escritorio/DSW/tp_frontend_dsw/src/components/Pages/Shop.jsx';
let s = fs.readFileSync(p, 'utf8');
if (!s.includes("import api from '../../services/api'")) {
  s = s.replace(/import \{ toast, ToastContainer \} from 'react-toastify';?\n/, "import { toast, ToastContainer } from 'react-toastify';\nimport api from '../../services/api';\n");
}
if (!s.includes('const [files, setFiles] = useState([]);')) {
  s = s.replace("const fileInputRef = useRef(null);", "const fileInputRef = useRef(null);\n  const [files, setFiles] = useState([]);\n");
}
// replace handleFiles function
s = s.replace(/const handleFiles = async \(e\) => \{[\s\S]*?\n  \};/, `const handleFiles = async (e) => {
    const rawFiles = Array.from(e.target.files || []).slice(0, 4); // keep File objects
    if (rawFiles.length === 0) return;

    try {
      // store raw files for upload
      setFiles(rawFiles);

      // create data URLs for previews (keeps existing preview behavior)
      const dataUrls = await Promise.all(
        rawFiles.map((f) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(f);
        }))
      );
      const updated = { ...form };
      if (dataUrls[0]) updated.image = dataUrls[0];
      if (dataUrls[1]) updated.secondImage = dataUrls[1];
      if (dataUrls[2]) updated.thirdImage = dataUrls[2];
      if (dataUrls[3]) updated.fourthImage = dataUrls[3];
      setForm(updated);
    } catch {
      toast.error('Error al procesar las imágenes');
    }
  };`);

// Replace try-catch saving to localStorage with API call
const newTry = `    try {
      // Preparar FormData para enviar al backend
      const formData = new FormData();
      formData.append('Productname', newProduct.Productname);
      formData.append('price', newProduct.price);
      if (newProduct.oldPrice) formData.append('oldPrice', newProduct.oldPrice);
      if (newProduct.tag) formData.append('tag', newProduct.tag);
      formData.append('category', newProduct.category);
      formData.append('stock', String(newProduct.stock));
      if (newProduct.description) formData.append('description', newProduct.description);
      if (newProduct.includes) formData.append('includes', newProduct.includes);
      if (newProduct.kayakTypeId) formData.append('kayakTypeId', String(newProduct.kayakTypeId));
      if (newProduct.supTypeId) formData.append('supTypeId', String(newProduct.supTypeId));
      if (newProduct.boatTypeId) formData.append('boatTypeId', String(newProduct.boatTypeId));
      if (newProduct.articleTypeId) formData.append('articleTypeId', String(newProduct.articleTypeId));
      // attach files stored in state
      files.forEach(f => formData.append('images', f));

      // intentamos crear via API
      await api.createProduct(formData);
      toast.success('Producto creado. Pendiente de aprobación.');
      setShowAddProduct(false);
      loadMyProducts(currentSeller.id);
      calculateStats(currentSeller.id, currentSeller?.rating);

      // Resetear formulario
      setForm({
        Productname: '',
        price: '',
        oldPrice: '',
        tag: '',
        category: '',
        stock: '1',
        image: '',
        secondImage: '',
        thirdImage: '',
        fourthImage: '',
        description: '',
        includes: '',
        kayakTypeId: '',
        supTypeId: '',
        boatTypeId: '',
        articleTypeId: '',
      });
      setFiles([]);
    } catch (err) {
      console.error('API create error', err);
      // Fallback: guardar en localStorage si el backend no responde
      const allProducts = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
      allProducts.push(newProduct);
      localStorage.setItem('marketplaceProducts', JSON.stringify(allProducts));
      toast.warn('Backend no disponible: producto guardado localmente');
      setShowAddProduct(false);
      loadMyProducts(currentSeller.id);
      calculateStats(currentSeller.id, currentSeller?.rating);
    }`;

let idxNewProduct = s.indexOf('const newProduct = {');
if (idxNewProduct !== -1) {
  let idxTry = s.indexOf('\n\n    try {', idxNewProduct);
  if (idxTry === -1) idxTry = s.indexOf('\n    try {', idxNewProduct);
  if (idxTry !== -1) {
    let idxCatch = s.indexOf('\n    } catch (err) {', idxTry);
    if (idxCatch !== -1) {
      let idxAfterCatch = s.indexOf('\n  };', idxCatch);
      if (idxAfterCatch === -1) idxAfterCatch = idxCatch + 1;
      s = s.slice(0, idxTry + 1) + newTry + s.slice(idxAfterCatch);
    }
  }
}

fs.writeFileSync(p, s, 'utf8');
console.log('Shop.jsx patched');
