/*Pagina de Terminos y Condiciones*/
/* Página informativa: sin checkbox ni botones de aceptación, SOLO TEXTO */
import React from 'react';

function Terms() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Términos y Condiciones</h2>

      <div
        className="border rounded p-4 mb-3"
        style={{
          maxHeight: '420px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        <h4>1. Objeto</h4>
        <p>
          Estos Términos y Condiciones regulan el uso del sitio web y la
          adquisición de productos a través de KBR (en adelante, "el Sitio"). Al
          utilizar el Sitio y/o realizar una compra, usted acepta estos términos
          en su totalidad.
        </p>

        <h4>2. Productos y disponibilidad</h4>
        <p>
          Los productos ofrecidos en el Sitio están sujetos a disponibilidad. En
          caso de falta de stock, nos comunicaremos para ofrecer alternativas o
          el reembolso correspondiente.
        </p>

        <h4>3. Precios y pagos</h4>
        <p>
          Los precios se indican en la moneda especificada en el Sitio. Nos
          reservamos el derecho de modificar precios sin previo aviso, aunque
          las compras ya confirmadas no se verán afectadas.
        </p>

        <h4>4. Envíos y devoluciones</h4>
        <p>
          Los costos y tiempos de envío dependerán de la ubicación de entrega y
          de la opción seleccionada. Las devoluciones se aceptan según la
          política de devoluciones publicada en el Sitio.
        </p>

        <h4>5. Propiedad intelectual</h4>
        <p>
          Todo el contenido del Sitio (textos, imágenes, marcas, logos, diseños)
          es propiedad de sus titulares y está protegido por las leyes de
          propiedad intelectual.
        </p>

        <h4>6. Privacidad</h4>
        <p>
          Trataremos sus datos de acuerdo con nuestra Política de Privacidad. Al
          usar el Sitio, usted consiente el procesamiento de sus datos conforme
          a la misma.
        </p>

        <h4>7. Limitación de responsabilidad</h4>
        <p>
          En la medida permitida por la ley, KBR no será responsable por daños
          indirectos, pérdida de beneficios o de datos derivados del uso del
          Sitio.
        </p>

        <h4>8. Ley aplicable y jurisdicción</h4>
        <p>
          Estos términos se regirán por las leyes vigentes en la República
          Argentina. Para cualquier controversia, las partes se someten a la
          jurisdicción de los tribunales competentes.
        </p>

        <p>Fecha de última actualización: 14 de octubre de 2025</p>
      </div>
    </div>
  );
}

export default Terms;
