-- CreateTable
CREATE TABLE "Gorev" (
    "id" SERIAL NOT NULL,
    "baslik" TEXT NOT NULL,
    "tamamlandi" BOOLEAN NOT NULL DEFAULT false,
    "olusturmaTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gorev_pkey" PRIMARY KEY ("id")
);
