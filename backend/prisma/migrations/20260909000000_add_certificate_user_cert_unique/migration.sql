-- CreateIndex
CREATE UNIQUE INDEX "certificates_userId_certificationCode_key" ON "certificates"("userId", "certificationCode");
