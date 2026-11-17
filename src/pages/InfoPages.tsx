import { Phone, Info, Mail, Users, Target, Award } from "lucide-react";
import Layout from "@/components/Layout";

export const HelplinePage = () => (
  <Layout>
    <div className="pb-32 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Phone className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Helpline</h1>
          <p className="text-muted-foreground">24/7 livestock support</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="vetra-card p-6">
          <h3 className="font-semibold mb-4">Emergency Support</h3>
          <div className="space-y-3">
            <a href="tel:1800-XXX-XXXX" className="vetra-button-primary w-full flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call 1800-XXX-XXXX
            </a>
            <p className="text-sm text-muted-foreground text-center">
              Toll-free • Available 24/7
            </p>
          </div>
        </div>

        <div className="vetra-card p-6">
          <h3 className="font-semibold mb-4">Common Issues</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Animal Health Emergency</p>
              <p className="text-muted-foreground">Contact nearest veterinary hospital</p>
            </div>
            <div>
              <p className="font-medium">VETRA App Issues</p>
              <p className="text-muted-foreground">Technical support available</p>
            </div>
            <div>
              <p className="font-medium">Livestock Management</p>
              <p className="text-muted-foreground">Expert guidance on best practices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export const AboutPage = () => (
  <Layout>
    <div className="pb-32 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Info className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">About VETRA</h1>
          <p className="text-muted-foreground">Livestock trait extraction platform</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="vetra-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Our Mission</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            To empower livestock farmers with AI-powered technology for accurate trait measurement 
            and improved animal management practices.
          </p>
        </div>

        <div className="vetra-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Technology</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Advanced computer vision algorithms</p>
            <p>• Machine learning models trained on livestock data</p>
            <p>• Real-time image processing capabilities</p>
          </div>
        </div>

        <div className="vetra-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Partnership</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Prototype built for Smart India Hackathon 2025. Not an official
            Government of India application.
          </p>
        </div>

        <div className="vetra-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            VETRA v1.0.0<br />
            © 2025 VETRA team (SIH 2025 prototype)
          </p>
        </div>
      </div>
    </div>
  </Layout>
);

export const ContactPage = () => (
  <Layout>
    <div className="pb-32 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground">Get in touch with our team</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="vetra-card p-6">
          <h3 className="font-semibold mb-4">Support Team</h3>
          <div className="space-y-3">
            <a href="mailto:support@example.com" className="vetra-button-primary w-full flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              support@example.com
            </a>
          </div>
        </div>

        <div className="vetra-card p-6">
          <h3 className="font-semibold mb-4">Address</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Placeholder address (prototype)</p>
          </div>
        </div>

        <div className="vetra-card p-6">
          <h3 className="font-semibold mb-4">Quick Response</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Technical Issues</span>
              <span className="text-primary font-medium">2-4 hours</span>
            </div>
            <div className="flex justify-between">
              <span>General Queries</span>
              <span className="text-primary font-medium">24 hours</span>
            </div>
            <div className="flex justify-between">
              <span>Feature Requests</span>
              <span className="text-primary font-medium">1-2 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);