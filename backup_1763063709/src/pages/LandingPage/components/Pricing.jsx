import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Pricing = ({ isAnnualBilling, setIsAnnualBilling, handleGoogleSuccess, handleGoogleError }) => {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="font-display text-4xl lg:text-5xl font-medium mb-6">
            Elige el Plan Perfecto para
            <span className="text-soft-rose">Tu Salón</span>
          </h2>
          <p className="text-xl text-warm-gray max-w-3xl mx-auto mb-8">
            Desde salones emergentes hasta establecimientos establecidos, tenemos el plan ideal para ayudarte a crecer.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className="text-warm-gray">Mensual</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="billing-toggle" className="sr-only peer" onChange={(e) => setIsAnnualBilling(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-soft-rose"></div>
            </label>
            <span className="text-warm-gray">Anual <span className="text-soft-rose text-sm">(2 meses gratis)</span></span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="pricing-card p-8 rounded-2xl">
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl font-medium mb-2">Asistente de Agenda</h3>
              <p className="text-warm-gray mb-6">Perfecto para salones que comienzan</p>
              <div className="mb-6">
                <span className="font-display text-4xl font-medium" id="free-price">Gratis</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Agendamiento básico</span></li>
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Hasta 50 citas mensuales</span></li>
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Cupones y promociones</span></li>
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Soporte por email</span></li>
            </ul>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>

          <div className="pricing-card featured p-8 rounded-2xl relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><span className="bg-soft-rose text-white px-6 py-2 rounded-full text-sm font-medium">Más Popular</span></div>
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl font-medium mb-2">Nails Now Pro</h3>
              <p className="text-warm-gray mb-6">Para salones que quieren crecer</p>
              <div className="mb-6">
                <span className="font-display text-4xl font-medium" id="premium-price">${isAnnualBilling ? '2980/Yr' : '298/Mo'}</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Todas las funciones del plan gratis</span></li>
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Citas ilimitadas</span></li>
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Control completo de inventario</span></li>
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Reportes financieros avanzados</span></li>
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Sitio web personalizado</span></li>
              <li className="flex items-center"><svg className="text-sage-green mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg><span>Soporte prioritario 24/7</span></li>
            </ul>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
