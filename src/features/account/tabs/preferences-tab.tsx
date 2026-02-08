"use client";

import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export function PreferencesTab() {
  return (
    <div className="space-y-4 lg:space-y-6 max-w-2xl">
      {/* Email Preferences Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white">Email Preferences</CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Control what email notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Dataset Updates</Label>
              <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                Receive notifications when your datasets are updated
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Purchase Confirmations</Label>
              <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                Get confirmations for dataset purchases
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">New Dataset Alerts</Label>
              <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                Alerts when new datasets matching your interests are available
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Marketing Emails</Label>
              <p className="text-xs text-[#4e5a7e] dark:text-white/60">
                Receive promotional content and feature announcements
              </p>
            </div>
            <Switch />
          </div>
          <div className="pt-4">
            <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Currency & Locale Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white">Currency & Locale</CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Set your preferred currency and regional settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="inr">INR (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Select defaultValue="utc">
              <SelectTrigger className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
                <SelectItem value="ist">India Standard Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="pt-4">
            <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
