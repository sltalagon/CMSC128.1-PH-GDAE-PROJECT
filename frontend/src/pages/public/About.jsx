import { Target, AlertCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">About PH-GDAE</h2>
        <p className="text-slate-600">Philippine Gene–Disease Association Explorer</p>
      </div>

      {/* Mission Card */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-start gap-4">
          <Target size={32} className="mt-1" />
          <div>
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="leading-relaxed opacity-90">
              To provide a centralized, accessible platform for exploring gene-disease relationships relevant to the Philippines population, empowering students, researchers, and educators with locally contextualized bioinformatics resources.
            </p>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <AlertCircle size={32} className="text-orange-500 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">The Challenge</h3>
            <p className="text-slate-600 leading-relaxed">
              In the Philippines, genetic and disease-related data are often fragmented across international databases, research publications, and institutional records. There is limited access to simplified, locally contextualized bioinformatics tools for students and early-stage researchers.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;